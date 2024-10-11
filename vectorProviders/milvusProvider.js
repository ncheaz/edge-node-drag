import { VectorProvider } from "./vectorProvider";
import { MilvusClient } from "@zilliz/milvus2-sdk-node";

export class MilvusProvider extends VectorProvider {
  constructor(config) {
    super(config);
    this.outputFields = config.output_fields || [];
    this.limit = config.limit || 10;
    this.client = new MilvusClient({ address: this.address, token: this.token });
}

  async vectorSearch(collection, query) {
    return await client.search({
        collection,
        vector: query,
        output_fields: this.outputFields,
        limit: this.limit,
      });
  }
}
