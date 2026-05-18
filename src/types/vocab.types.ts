export enum PosType {
  Noun = "명사 (Danh từ)",
  Verb = "동사 (Động từ)",
  Adjective = "형용사 (Tính từ)",
  Adverb = "부사 (Trạng từ)",
  Particle = "조사 (Trợ từ)",
  Ending = "어미 (Đuôi câu)",
  Unknown = "알 수 없음"
}

export interface Example {
  kr: string;
  vi: string;
}

export interface VocabEntry {
  k: string;         // Korean word
  base: string;      // Dictionary form
  p: string;         // Pronunciation
  pos: string;       // Part of speech
  vi: string;        // Vietnamese meaning
  krdef: string;     // Korean definition
  videf: string;     // Vietnamese explanation
  examples: Example[];
  synonyms: string[];
  antonyms: string[];
  tags: string[];
  level: number;     // TOPIK level
}

export interface AIWordAnalysis {
  surface: string;
  base: string;
  meaning_in_context_vi: string;
  pos: string;
  synonym: string;
  antonym: string;
  example: string;
}
