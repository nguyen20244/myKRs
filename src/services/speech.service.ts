export const SpeechService = {
  speak: (text: string, lang = 'ko-KR'): void => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};
