const { MilvusClient } = require("@zilliz/milvus2-sdk-node");
const { HuggingFaceInferenceEmbeddings } = require("@langchain/community/embeddings/hf");
const fetch = require("node-fetch");
const logger = require("../utils/logger.js");

globalThis.fetch = fetch;

class VectorSearchService {
  constructor(userData) {
    this.collectionName = userData.collectionName;
    this.hfModel = new HuggingFaceInferenceEmbeddings({
      apiKey: userData.embeddingModelAPIKey,
      model: userData.embeddingModel,
    });
    this.client = new MilvusClient({
      address: userData.vectorDBUri,
      token: userData.vectorDBUsername + ":" + userData.vectorDBPassword,
    });
  }

  async search(question, fields, filter = null, limit = null) {
    try {
      const startGetEmbeddingTime = new Date();
      const questionEmbedding = await this.hfModel.embedQuery(question);
      const endGetEmbeddingTime = new Date();
      logger.info(
        `Obtained question embedding of length ${questionEmbedding.length} in ${
          endGetEmbeddingTime - startGetEmbeddingTime
        } milliseconds`
      );

      const vectorResponse = await this.client.search({
        collection_name: this.collectionName,
        filter: filter,
        vector: questionEmbedding,
        output_fields: fields,
        limit: limit,
      });

      return vectorResponse;
    } catch (error) {
      logger.error("Error during vector search:" + error.message);
      return { results: [] }; // Return empty array or handle error as needed
    }
  }
}

module.exports = VectorSearchService;
