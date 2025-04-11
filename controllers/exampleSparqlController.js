const LLMService = require('../services/llmService.js');
const DKGService = require('../services/nodeService.js');
const { processQuestion } = require('../services/nlpService.js');
const logger = require('../utils/logger.js');
const { getKnowledgeAssetsGeneric } = require('../utils/utils.js');
const authService = require('../services/authService.js');
const { getSparqlQuery } = require('../utils/utils.js');

module.exports = {
    async ask(req, res, next) {
        try {
            const { question, chatHistory } = req.body;

            const userData = await authService.authenticateAndCache(req);

            const llmService = new LLMService(userData);

            const dkgService = new DKGService(userData);

            const { standaloneQuestion } = await processQuestion(
                llmService,
                question,
                chatHistory
            );

            const headline =
                await llmService.getDigitalDocumentTitle(standaloneQuestion);

            const sparqlQuery = getSparqlQuery(headline);

            const queryResults = await dkgService.query(sparqlQuery, userData);

            let result = queryResults[0];
            if (result.length === 0) {
                return res.status(200).send({
                    answer: 'No information was found related to the question you provided.',
                    knowledgeAssets: []
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
                knowledgeAssets
            });
        } catch (e) {
            logger.error('Error in ask: ' + e.stack);
        }
    }
};
