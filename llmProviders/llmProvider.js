class LLMProvider {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.model = config.model;
        this.temperature = config.temperature || 0;
        this.max_tokens = config.max_tokens;
    }

    async createChatCompletion(prompt, stream) {
        throw new Error('Method not implemented');
    }
}

module.exports = LLMProvider;
