import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import KeyboardButton from './KeyboardButton';
import { firstRowLetters, secondRowLetters, thirdRowLetters } from '../data/KeyboardLetters';

type Props = {
  /**
   * An array of all the guesses.
   * 
   * TODO: Clean this logic up. The keyboard should not know about the guesses.
   */
  guesses: string[][];

  /**
   * The word the user has to guess.
   * 
   * TODO: Clean this logic up. The keyboard should not know about the guesses.
   */
  wordToGuess: string;

  /**
   * A callback function that is triggered when the user presses a key.
   */
  onPressKey: (key: string) => void;

  /**
   * A callback function that is triggered when the user presses the backspace key.
   */
  onBackspace: () => void;

  /**
   * A callback function that is triggered when the user presses the enter key.
   */
  onEnter: () => void;
};
const Keyboard = ({ guesses, wordToGuess, onPressKey, onBackspace, onEnter }: Props) => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  const isKeyAbsent = (letter: string) => {
    return guesses.some(guess => guess.indexOf(letter) >= 0) &&
      !wordToGuess.includes(letter.toUpperCase());
  }

  const isKeyCorrect = (letter: string) => {
    return guesses.some(guess => guess.findIndex((guessLetter, idx) => guessLetter === letter && wordToGuess[idx] === letter) >= 0) &&
      wordToGuess.includes(letter.toUpperCase());
  }

  const isUnused = (letter: string) => {
    return guesses.every(guess => guess.indexOf(letter) < 0);
  }

  const getStatus = (key: string) => {
    return isKeyAbsent(key) ? 'absent' : isKeyCorrect(key) ? 'correct' : isUnused(key) ? 'unused' : 'misplaced';
  };

  return (
    <>
      <View style={styles.keyboardRow}>
        {firstRowLetters.map(key => (
          <KeyboardButton
            key={key}
            label={key}
            onPress={() => onPressKey(key)}
            status={getStatus(key)}
          />
        ))}
      </View>
      <View style={styles.keyboardRow}>
        {secondRowLetters.map(key => (
          <KeyboardButton
            key={key}
            label={key}
            onPress={() => onPressKey(key)}
            status={getStatus(key)}
          />
        ))}
      </View>
      <View style={styles.keyboardRow}>
        <KeyboardButton
          label='ENTER'
          onPress={onEnter}
          isFunctionalKey={true}
          status='unused'
          />
        {thirdRowLetters.map(key => (
          <KeyboardButton
            key={key}
            label={key}
            onPress={() => onPressKey(key)}
            status={isKeyAbsent(key) ? 'absent' : isKeyCorrect(key) ? 'correct' : isUnused(key) ? 'unused' : 'misplaced'}
          />
        ))}
        <KeyboardButton
          label='BACK'
          onPress={onBackspace}
          isFunctionalKey={true}
          status='unused'
          />
      </View>
    </>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    keyboardContainer: {
    },
    keyboardRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
      marginTop: 10,
      marginHorizontal: 20,
    },
  });
export default Keyboard;