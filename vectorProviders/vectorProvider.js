class VectorProvider {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.address = config.address;
        this.token = config.token;
    }

    async vectorSearch(collection, query) {
        throw new Error('Method not implemented');
    };
}

module.exports = VectorProvider;