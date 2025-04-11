const MilvusProvider = require('./milvusProvider');

class VectorProviderFactory {
    static createProvider(config) {
        switch (config.provider) {
            case 'milvus':
                return new MilvusProvider(config);
            default:
                throw new Error('Unsupported Vector provider');
        }
    }
}

module.exports = VectorProviderFactory;
