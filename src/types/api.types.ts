import { AIWordAnalysis, AIGrammarAnalysis } from "./vocab.types";

export interface ApiConfig {
  keys: string[];
  model: string;
  provider: "gemini" | "openrouter";
}

export interface AIResponse {
  korean_text: string;
  vietnamese_translation: string;
  word_analysis: AIWordAnalysis[];
  grammar_analysis: AIGrammarAnalysis[];
}

export interface ApiError {
  status: number;
  message: string;
  type: "quota" | "invalid_key" | "network" | "other";
}
