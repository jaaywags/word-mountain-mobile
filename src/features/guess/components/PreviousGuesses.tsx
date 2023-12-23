import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  guesses: string[][];
  wordToGuess: string;
};
const PreviousGuesses = ({ guesses, wordToGuess }: Props) => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  const isAbsent = (letter: string) => {
    return !wordToGuess.includes(letter.toUpperCase());
  }

  const isCorrect = (letter: string, index: number) => {
    return wordToGuess[index] === letter;
  }

  return (
    <>
      {guesses.map((guess: string[], guessIndex: number) => (
        <View key={`guessIndex-${guessIndex}`} style={styles.currentWordRow}>
          {guess.map((letter: string, index: number) => (
            <View key={`guessIndex-${guessIndex}-letterIndex-${index}`} style={isAbsent(letter) ? styles.absentBtn : isCorrect(letter, index) ? styles.correctBtn : styles.misplacedBtn}>
              <Text style={isAbsent(letter) ? styles.absentText : isCorrect(letter, index) ? styles.correctText : styles.misplacedText}>{letter}</Text>
            </View>
          ))}
        </View>
      ))}
    </>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    absentText: {
      color: isDarkMode ? '#fff' : '#b8b8b8',
      fontSize: 20,
    },
    misplacedText: {
      color: '#424242',
      fontSize: 20,
    },
    correctText: {
      color: '#424242',
      fontSize: 20,
    },
    absentBtn: {
      backgroundColor: isDarkMode ? '#b8b8b8' : '#424242',
      width: 40,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    misplacedBtn: {
      backgroundColor: '#ffa200',
      width: 40,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    correctBtn: {
      backgroundColor: '#33ba18',
      width: 40,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    currentWordRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 5,
    },
  });

export default PreviousGuesses;