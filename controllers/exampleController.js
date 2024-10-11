import cacheService from "../services/cacheService.js";
import LLMService from "../services/llmService.js";
import DKGService from "../services/nodeService.js";
import VectorSearchService from "../services/vectorSearchService.js";
import { processQuestion } from "../services/nlpService.js";
import logger from "../utils/logger.js";
import { getKnowledgeAssetsGeneric } from "../utils/utils.js";
import RerankerService from "../services/rerankerService.js";
import authService from "../services/authService.js";
import { getSparqlQuery } from "../utils/utils.js";
export default {
  async ask(req, res, next) {
    try {
      const { question, chatHistory } = req.body;

      const userData = await authService.authenticateAndCache(req.sessionSid);

      const llmService = new LLMService(userData);

      const dkgService = new DKGService(userData);

      const { standaloneQuestion } = await processQuestion(
        llmService,
        question,
        chatHistory
      );

      const contentType = await llmService.getContentType(standaloneQuestion);

      const sparqlQuery = getSparqlQuery(contentType);

      const queryResults = await dkgService.query(
        sparqlQuery,
        userData.paranetUAL
      );

      let result = queryResults[0];
      if (result.length === 0) {
        return res.status(200).send({
          answer:
            "No information was found related to the question you provided.",
          knowledgeAssets: [],
        });
      }
      const knowledgeAssets = getKnowledgeAssetsGeneric(
        result,
        userData.environment
      );

      const answer = await llmService.generateResponse(
        question,
        standaloneQuestion,
        result
      );

      return res.status(200).send({
        answer,
        knowledgeAssets,
      });
    } catch (e) {
      logger.error("Error in ask: " + e.message);
    }
  },
};
