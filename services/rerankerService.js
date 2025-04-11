const { CohereClient } = require("cohere-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const logger = require("../utils/logger.js");

class RerankerService {
  constructor(apiKey) {
    this.client = new CohereClient({ token: apiKey });
  }

  async rerankAnswers(answers, question, limit = 10) {
    const rerank = await this.client.rerank({
      documents: answers,
      query: question,
      topN: limit,
      model: "rerank-multilingual-v3.0",
    });

    return rerank.results;
  }
}

module.exports = RerankerService;
