const VectorProvider = require("./vectorProvider");
const { MilvusClient } = require("@zilliz/milvus2-sdk-node");

class MilvusProvider extends VectorProvider {
  constructor(config) {
    super(config);
    this.outputFields = config.output_fields || [];
    this.limit = config.limit || 10;
    this.client = new MilvusClient({ address: this.address, token: this.token });
}

  async vectorSearch(collection, query) {
    return await this.client.search({
        collection,
        vector: query,
        output_fields: this.outputFields,
        limit: this.limit,
      });
  }
}

module.exports = MilvusProvider;
