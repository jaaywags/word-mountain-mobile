import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useWordToGuess from '@features/dictionary/hooks/useWordToGuess';
import AllKnownEnglishWords5Letters from '@features/dictionary/data/AllKnownEnglishWords-5Letters';
import { storage } from '@features/mmkv/storage';
import useHideSplashScreen from '@features/splashScreen/hooks/useHideSplashScreen';
import Keyboard from '@features/keyboard/components/Keyboard';
import OverallScore from '@features/score/components/OverallScore';
import CurrentGameScore from '@features/score/components/CurrentGameScore';

const App = () => {
  useHideSplashScreen();
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);
  const { wordToGuess, refreshWord } = useWordToGuess();
  const [guessCount, setGuessCount] = useState(0);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [currentWordLetters, setCurrentWordLetters] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isInvalidWord, setIsInvalidWord] = useState(false);

  const onPressKey = (key: string) => {
    if (currentWordLetters.length === 5 || success || failed) {
      return;
    }

    setCurrentWordLetters([...currentWordLetters, key.toUpperCase()]);
  };

  const onBackspace = () => {
    setIsInvalidWord(false);
    if (currentWordLetters.length === 0 || success || failed) {
      return;
    }

    setCurrentWordLetters(currentWordLetters.slice(0, currentWordLetters.length - 1));
  };

  const onEnter = () => {
    setIsInvalidWord(false);
    if (currentWordLetters.length !== 5 || success || failed) {
      return;
    }

    if (AllKnownEnglishWords5Letters.findIndex(word => word.toUpperCase() === currentWordLetters.join('')) < 0) {
      setIsInvalidWord(true);
      return;
    }

    if (currentWordLetters.join('').toUpperCase() === wordToGuess.toUpperCase()) {
      const wins = storage.getNumber('wins');
      storage.set('wins', (wins ?? 0) + 1);
      setSuccess(true);
      return;
    }

    if (guessCount === 5) {
      const loses = storage.getNumber('loses');
      storage.set('loses', (loses ?? 0) + 1);
      setFailed(true);
      return;
    }

    setGuesses([...guesses, [...currentWordLetters]]);
    setCurrentWordLetters([]);
    setGuessCount(guessCount + 1);
  };

  const remainingGuesses = [...Array(5 - guessCount).keys()];

  const isAbsent = (letter: string) => {
    return !wordToGuess.includes(letter.toUpperCase());
  }

  const isCorrect = (letter: string, index: number) => {
    return wordToGuess[index] === letter;
  }

  const onReset = () => {
    if (!failed && !success) {
      const skips = storage.getNumber('skips');
      storage.set('skips', (skips ?? 0) + 1);
    }
  
    setFailed(false);
    setSuccess(false);
    setIsInvalidWord(false);
    setGuesses([]);
    setGuessCount(0);
    setCurrentWordLetters([]);
    refreshWord();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#242423' : '#ededed'}
      />
      <View style={styles.headerSection}>
        <Text style={styles.headerText}>WORD MOUNTAIN</Text>
        <OverallScore />
        <TouchableOpacity
          onPress={onReset}
          activeOpacity={0.7}
          style={styles.resetBtn}
        >
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.guessSection}>
        {/* previous guesses */}
        {guesses.map((guess: string[], guessIndex: number) => (
          <View key={`guessIndex-${guessIndex}`} style={styles.currentWordRow}>
            {guess.map((letter: string, index: number) => (
              <View key={`guessIndex-${guessIndex}-letterIndex-${index}`} style={isAbsent(letter) ? styles.absentBtn : isCorrect(letter, index) ? styles.correctBtn : styles.misplacedBtn}>
                <Text style={isAbsent(letter) ? styles.absentText : isCorrect(letter, index) ? styles.correctText : styles.misplacedText}>{letter}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* current guess */}
        <View style={styles.currentWordRow}>
          <View style={success ? styles.correctBtn : styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[0] ?? ''}</Text>
          </View>
          <View style={success ? styles.correctBtn : styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[1] ?? ''}</Text>
          </View>
          <View style={success ? styles.correctBtn : styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[2] ?? ''}</Text>
          </View>
          <View style={success ? styles.correctBtn : styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[3] ?? ''}</Text>
          </View>
          <View style={success ? styles.correctBtn : styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[4] ?? ''}</Text>
          </View>
        </View>

        {/* future guesses */}
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
      </View>

      <View style={styles.keyboardSection}>
        <CurrentGameScore
          wordToGuess={wordToGuess}
          isInvalidWord={isInvalidWord}
          success={success}
          failed={failed}
          />

        <Keyboard
          guesses={guesses}
          wordToGuess={wordToGuess}
          onPressKey={onPressKey}
          onBackspace={onBackspace}
          onEnter={onEnter}
          />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: isDarkMode ? '#242423' : '#ededed',
    },
    headerSection: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    guessSection: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    keyboardSection: {
      width: '100%',
      marginBottom: 40,
    },
    headerText: {
      fontSize: 28,
      fontWeight: '700',
      color: isDarkMode ? '#ededed' : '#242423',
    },
    resetBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#348feb',
      paddingHorizontal: 70,
      paddingVertical: 10,
      borderRadius: 2,
      marginTop: 10,
    },
    resetText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#ededed',
    },
    currentWordRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      marginTop: 5,
    },
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
  });

export default App;
