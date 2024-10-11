import { AnthropicProvider } from "./anthropicProvider.js";
import { OpenAIProvider } from "./openaiProvider.js";

export class LLMProviderFactory {
  static createProvider(config) {
    switch (config.provider) {
      case "openai":
        return new OpenAIProvider(config);
      case "anthropic":
        return new AnthropicProvider(config);
      default:
        throw new Error("Unsupported LLM provider");
    }
  }
}
