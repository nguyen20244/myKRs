export interface Example {
  kr: string;
  vi: string;
}

export interface GrammarEntry {
  pattern: string;
  meaning_vi: string;
  usage_vi: string;
  formula: string;
  examples: Example[];
  level: number;
  detect: string[];
}

export interface AIGrammarAnalysis {
  pattern: string;
  sentence: string;
  meaning_vi: string;
  usage_vi: string;
}
