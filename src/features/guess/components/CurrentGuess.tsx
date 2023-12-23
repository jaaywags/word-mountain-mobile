import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  /**
   * Flag indicating the user won.
   */
  success: boolean;

  /**
   * Flag indicating the user lost.
   */
  failed: boolean;

  /**
   * Array of the letters for the current guess.
   */
  currentWordLetters: string[];
}
const CurrentGuess = ({ success, failed, currentWordLetters }: Props) => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.container}>
      <View style={success ? styles.correctBtn : failed ? styles.failedBtn : styles.letterContainer}>
        <Text style={styles.letter}>{currentWordLetters?.[0] ?? ''}</Text>
      </View>
      <View style={success ? styles.correctBtn : failed ? styles.failedBtn : styles.letterContainer}>
        <Text style={styles.letter}>{currentWordLetters?.[1] ?? ''}</Text>
      </View>
      <View style={success ? styles.correctBtn : failed ? styles.failedBtn : styles.letterContainer}>
        <Text style={styles.letter}>{currentWordLetters?.[2] ?? ''}</Text>
      </View>
      <View style={success ? styles.correctBtn : failed ? styles.failedBtn : styles.letterContainer}>
        <Text style={styles.letter}>{currentWordLetters?.[3] ?? ''}</Text>
      </View>
      <View style={success ? styles.correctBtn : failed ? styles.failedBtn : styles.letterContainer}>
        <Text style={styles.letter}>{currentWordLetters?.[4] ?? ''}</Text>
      </View>
    </View>
  );
};
const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    letterContainer: {
      backgroundColor: isDarkMode ? '#ededed' : '#242423',
      width: 40,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    letter: {
      fontSize: 20,
    },
    correctBtn: {
      backgroundColor: '#33ba18',
      width: 40,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    failedBtn: {
      backgroundColor: '#d93f44',
      width: 40,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 5,
    },
  });

export default CurrentGuess;