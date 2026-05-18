import { GrammarEntry, AIGrammarAnalysis } from "../types/grammar.types";
import { INITIAL_GRAMMAR } from "../data/grammar";

export const GrammarDetectorService = {
  detect: (text: string, customGrammar?: GrammarEntry[]): AIGrammarAnalysis[] => {
    const activeGrammar = customGrammar || INITIAL_GRAMMAR;
    const found: AIGrammarAnalysis[] = [];
    
    activeGrammar.forEach(g => {
      if (g.detect.some(pattern => text.includes(pattern))) {
        found.push({
          pattern: g.pattern,
          sentence: text, // In a real app, we'd find the specific sentence
          meaning_vi: g.meaning_vi,
          usage_vi: g.usage_vi
        });
      }
    });
    
    return found;
  }
};
