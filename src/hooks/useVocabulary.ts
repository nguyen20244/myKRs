import { useState, useMemo } from "react";
import { VocabEntry } from "../types/vocab.types";
import { MANUAL_VOCAB, RAW_VOCAB_DATA } from "../data/vocab";
import { useLocalStorage } from "./useLocalStorage";
import { STORAGE_KEYS } from "../services/storage.service";

export function useVocabulary() {
  const initialVocab = useMemo(() => {
    const parsed: VocabEntry[] = RAW_VOCAB_DATA.trim().split('\n').map(line => {
      const parts = line.split('\t');
      if (parts.length < 6) return null;
      const [kRaw, p, pos, vi, krdef, videf] = parts;
      const k = kRaw.replace(/\d+$/, '');
      return {
        k, base: k, p: p || `[${k}]`, pos, vi, krdef, videf,
        examples: [{ kr: `${k} ví dụ.`, vi: `Ví dụ cho ${vi}.` }],
        synonyms: [], antonyms: [], tags: [], level: 1
      };
    }).filter((e): e is VocabEntry => e !== null);

    const map = new Map<string, VocabEntry>();
    parsed.forEach(v => map.set(v.k, v));
    MANUAL_VOCAB.forEach(v => map.set(v.k, v));
    return Array.from(map.values());
  }, []);

  const [vocabDB, setVocabDB] = useLocalStorage<VocabEntry[]>(STORAGE_KEYS.VOCAB_DB, initialVocab);
  const [weakWords, setWeakWords] = useLocalStorage<string[]>(STORAGE_KEYS.WEAK_WORDS, []);

  const addVocabUnit = (unit: VocabEntry) => {
    setVocabDB(prev => {
      const exists = prev.find(v => v.k === unit.k);
      if (exists) return prev;
      return [...prev, unit];
    });
  };

  const markWeak = (word: string) => {
    if (!weakWords.includes(word)) {
      setWeakWords(prev => [...prev, word]);
    }
  };

  const unmarkWeak = (word: string) => {
    setWeakWords(prev => prev.filter(w => w !== word));
  };

  const bulkImport = (data: string) => {
    const lines = data.trim().split('\n');
    const newEntries: VocabEntry[] = lines.map(line => {
      const parts = line.split('\t');
      if (parts.length < 4) return null;
      const [kRaw, p, pos, vi, krdef, videf] = parts;
      const k = kRaw.replace(/\d+$/, '');
      return {
        k, base: k, p: p || `[${k}]`, pos, vi, krdef: krdef || '', videf: videf || '',
        examples: [{ kr: `${k} ví dụ.`, vi: `Ví dụ cho ${vi}.` }],
        synonyms: [], antonyms: [], tags: [], level: 1
      };
    }).filter((e): e is VocabEntry => e !== null);

    setVocabDB(prev => {
      const map = new Map();
      prev.forEach(v => map.set(v.k, v));
      newEntries.forEach(v => map.set(v.k, v));
      return Array.from(map.values());
    });
  };

  return {
    vocabDB,
    weakWords,
    markWeak,
    unmarkWeak,
    addVocabUnit,
    bulkImport,
    setVocabDB
  };
}
