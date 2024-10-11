import { LLMProvider } from "./llmProvider.js";
import Anthropic from "@anthropic-ai/sdk";

export class AnthropicProvider extends LLMProvider {
  constructor(config) {
    super(config);
    this.anthropic = new Anthropic({ apiKey: this.apiKey });
  }

  async createChatCompletion(prompt) {
    const baseConfig = {
      model: this.model || "claude-3-haiku-20240307",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 4096,
      temperature: this.temperature || 0,
    };

    const message = await this.anthropic.messages.create(baseConfig);
    return message.content[0].text;
  }
}
