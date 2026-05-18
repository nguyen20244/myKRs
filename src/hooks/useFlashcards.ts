import { useState } from "react";

export function useFlashcards(total: number) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const next = () => {
    setIsFlipped(false);
    setIndex(prev => (prev + 1) % (total || 1));
  };

  const prev = () => {
    setIsFlipped(false);
    setIndex(prev => (prev - 1 + total) % (total || 1));
  };

  const flip = () => setIsFlipped(!isFlipped);

  return {
    index,
    isFlipped,
    next,
    prev,
    flip,
    setIndex
  };
}
