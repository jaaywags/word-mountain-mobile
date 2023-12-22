import { useEffect, useState } from 'react';
import AllEnglishWords from '../data/MostPopularEnglishWords';

const useWordToGuess = () => {
  const [wordToGuess, setWordToGuess] = useState('');

  const generateWord = () => {
    // Get only words that are 5 letters
    const fiveLetterWords = AllEnglishWords.filter((word: string) => word.length === 5);

    // Pick a random word
    setWordToGuess(fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)]);
  };

  useEffect(() => {
    generateWord();
  }, []);
  
  return {
    wordToGuess: wordToGuess.toUpperCase(),
    refreshWord: generateWord,
  };
};

export default useWordToGuess;