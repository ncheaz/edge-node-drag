import { LLMProvider } from "./llmProvider.js";
import OpenAI from "openai";

export class OpenAIProvider extends LLMProvider {
  constructor(config) {
    super(config);
    this.openai = new OpenAI({ apiKey: this.apiKey });
  }

  async createChatCompletion(prompt, stream = false) {
    const baseConfig = {
      model: this.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: this.temperature,
      stream: stream,
    };

    const chatCompletion = await this.openai.chat.completions.create(
      baseConfig
    );

    return stream ? chatCompletion : chatCompletion.choices[0].message.content;
  }
}
