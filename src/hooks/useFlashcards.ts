import { useState, useEffect } from "react";

export function useFlashcards(total: number) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const [isShuffleMode, setIsShuffleMode] = useState(false);

  // Reset index when total changes (e.g. switching to weak-word mode)
  useEffect(() => {
    setIndex(0);
    setIsFlipped(false);
    setShuffled([]);
  }, [total]);

  const currentIndex = isShuffleMode && shuffled.length > 0 ? shuffled[index] : index;

  const next = () => {
    setIsFlipped(false);
    setIndex(prev => (prev + 1) % (total || 1));
  };

  const prev = () => {
    setIsFlipped(false);
    setIndex(prev => (prev - 1 + (total || 1)) % (total || 1));
  };

  const flip = () => setIsFlipped(f => !f);

  const shuffle = () => {
    const arr = Array.from({ length: total }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    setShuffled(arr);
    setIsShuffleMode(true);
    setIndex(0);
    setIsFlipped(false);
  };

  const clearShuffle = () => {
    setIsShuffleMode(false);
    setShuffled([]);
    setIndex(0);
    setIsFlipped(false);
  };

  return {
    index: currentIndex,
    sequenceIndex: index,
    total,
    isFlipped,
    isShuffleMode,
    next,
    prev,
    flip,
    shuffle,
    clearShuffle,
    setIndex
  };
}
