import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  remainingGuesses: number[];
};
const FutureGuesses = ({ remainingGuesses }: Props) => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  return (
    <>
    {remainingGuesses.map((index: number) => (
      <View style={styles.currentWordRow} key={`remainingGuesses-${index}`}>
        <View style={styles.letterContainer}>
          <Text style={styles.letter}></Text>
        </View>
        <View style={styles.letterContainer}>
          <Text style={styles.letter}></Text>
        </View>
        <View style={styles.letterContainer}>
          <Text style={styles.letter}></Text>
        </View>
        <View style={styles.letterContainer}>
          <Text style={styles.letter}></Text>
        </View>
        <View style={styles.letterContainer}>
          <Text style={styles.letter}></Text>
        </View>
      </View>
    ))}
    </>
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
    currentWordRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 5,
    },
  });

export default FutureGuesses;