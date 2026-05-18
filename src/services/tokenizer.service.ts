import { VocabEntry } from "../types/vocab.types";
import { KOREAN_STOPWORDS } from "../data/stopwords";

export const TokenizerService = {
  /**
   * Split Korean text into tokens and attempt to find basic dictionary forms.
   * This is a simple heuristic-based tokenizer.
   */
  tokenize: (text: string, vocabDB: VocabEntry[]): string[] => {
    // Remove punctuation
    const cleanText = text.replace(/[.,!?;:()]/g, ' ');
    const rawTokens = cleanText.split(/\s+/).filter(t => t.length > 0);
    
    const results: string[] = [];
    
    rawTokens.forEach(token => {
      // 1. Direct match
      if (vocabDB.some(v => v.k === token || v.base === token)) {
        results.push(token);
        return;
      }

      // 2. Remove common josa (particles)
      let matched = false;
      for (const stop of KOREAN_STOPWORDS) {
        if (token.endsWith(stop) && token.length > stop.length) {
          const stem = token.slice(0, -stop.length);
          if (vocabDB.some(v => v.k === stem || v.base === stem)) {
            results.push(stem);
            matched = true;
            break;
          }
        }
      }
      
      if (!matched) {
        // 3. Verb/Adjective conjugation heuristics (very basic)
        // e.g. 가요 -> 가다, 먹었어요 -> 먹다
        const verbStems = [
          { suffix: '아요', replacement: '다' },
          { suffix: '어요', replacement: '다' },
          { suffix: '해요', replacement: '하다' },
          { suffix: '았어요', replacement: '다' },
          { suffix: '었어요', replacement: '다' },
          { suffix: '습니다', replacement: '다' },
          { suffix: '니까', replacement: '다' },
        ];

        for (const rule of verbStems) {
          if (token.endsWith(rule.suffix)) {
            const stem = token.slice(0, -rule.suffix.length) + rule.replacement;
            if (vocabDB.some(v => v.base === stem)) {
              results.push(stem);
              matched = true;
              break;
            }
          }
        }
      }

      if (!matched) {
        results.push(token); // Fallback to raw token
      }
    });

    return Array.from(new Set(results));
  }
};
