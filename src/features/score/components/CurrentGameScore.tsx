import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  /**
   * What word the user has to guess.
   */
  wordToGuess: string;

  /**
   * Flag that indicates the user won.
   */
  success: boolean;

  /**
   * Flag that indicates the user lost.
   */
  failed: boolean;

  /**
   * Flag that indicates the current word is invalid.
   */
  isInvalidWord: boolean;
};
const CurrentGameScore = ({ wordToGuess, success, failed, isInvalidWord }: Props) => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.container}>
      {isInvalidWord && (<Text style={styles.invalidText}>Invalid word</Text>)}
      {failed && (<Text style={styles.invalidText}>Incorrect! The word was: {wordToGuess}</Text>)}
      {success && (<Text style={styles.successText}>Success!</Text>)}
    </View>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: 60,
    },
    invalidText: {
      color: '#d93f44',
      fontSize: 24,
      fontWeight: '700',
    },
    successText: {
      color: '#33ba18',
      fontSize: 24,
      fontWeight: '700',
    },
  });
export default CurrentGameScore;