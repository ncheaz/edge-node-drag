import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import logger from "../utils/logger.js";

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

export default RerankerService;
