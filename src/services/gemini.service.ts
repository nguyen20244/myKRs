import { ApiConfig, AIResponse } from "../types/api.types";

export class GeminiService {
  private badKeys: Set<string> = new Set();

  constructor(private config: ApiConfig) {}

  async generate(prompt: string): Promise<AIResponse> {
    for (const key of this.config.keys) {
      if (this.badKeys.has(key)) continue;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { 
                response_mime_type: "application/json",
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 2048,
              }
            })
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Gemini API Error:", errorData);
          if ([403, 429, 401].includes(response.status)) {
            this.badKeys.add(key);
          }
          continue;
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        return JSON.parse(text);
      } catch (err) {
        console.error("Fetch error or Parse error:", err);
        this.badKeys.add(key);
        continue;
      }
    }
    throw new Error("Tất cả API keys đều thất bại. Hãy kiểm tra lại cấu hình và Quota.");
  }

  resetBadKeys() {
    this.badKeys.clear();
  }

  getFailedKeysCount() {
    return this.badKeys.size;
  }
  
  isKeyFailed(key: string) {
    return this.badKeys.has(key);
  }
}
