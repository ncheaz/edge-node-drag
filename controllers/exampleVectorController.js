const LLMService = require("../services/llmService.js");
const VectorSearchService = require("../services/vectorSearchService.js");
const { processQuestion } = require("../services/nlpService.js");
const logger = require("../utils/logger.js");
const { getKnowledgeAssetsVector } = require("../utils/utils.js");
const RerankerService = require("../services/rerankerService.js");
const authService = require("../services/authService.js");
const { VECTOR_DB_THRESHOLD } = require("../utils/constants.js");

module.exports = {
  async ask(req, res, next) {
    try {
      const { question, chatHistory } = req.body;

      const userData = await authService.authenticateAndCache(req);

      const llmService = new LLMService(userData);

      const vectorService = new VectorSearchService({
        ...userData,
        collectionName: userData.vectorCollection,
      });

      const { standaloneQuestion } = await processQuestion(
        llmService,
        question,
        chatHistory
      );

      // Add or edit vector DB fields if you want (langchain_text, UAL)
      let vectorResponse = await vectorService.search(standaloneQuestion, [
        "langchain_text",
        "ual",
      ]);

      let extractedChunks = vectorResponse.results.filter(
        (res) => res.score >= VECTOR_DB_THRESHOLD
      );

      logger.info(`Vector search retrieved ${extractedChunks.length} results`);

      try {
        logger.info("Reranking chunks...");

        const rerankerService = new RerankerService(userData.cohereKey);
        const rerankedIndices = await rerankerService.rerankAnswers(
          extractedChunks.map((e) => e.langchain_text),
          standaloneQuestion,
          5
        );

        extractedChunks = rerankedIndices.map(
          (reranked) => extractedChunks[reranked.index]
        );
        logger.info(
          `Got top ${extractedChunks.length} results from Reranker. `
        );
      } catch (e) {
        logger.error(`Reranker error: ${e.message}`);
      }

      const knowledgeAssets = getKnowledgeAssetsVector(
        extractedChunks,
        userData.environment
      );

      const answer = await llmService.generateResponse(
        question,
        standaloneQuestion,
        extractedChunks
      );

      return res.status(200).send({
        answer,
        knowledgeAssets,
      });
    } catch (e) {
      logger.error("Error in ask: " + e.stack);
    }
  },
};
