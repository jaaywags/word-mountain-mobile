import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import KeyboardButton from '@features/buttons/components/KeyboardButton';
import useWordToGuess from '@features/dictionary/hooks/useWordToGuess';
import AllKnownEnglishWords5Letters from '@features/dictionary/data/AllKnownEnglishWords-5Letters';
import { storage } from '@features/mmkv/storage';
import useHideSplashScreen from '@features/splashScreen/hooks/useHideSplashScreen';

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

  const firstRowLetters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const secondRowLetters = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const thirdRowLetters = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

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
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Wins: {storage.getNumber('wins') ?? 0},{' '}</Text>
          <Text style={styles.statsText}>Loses: {storage.getNumber('loses') ?? 0},{' '}</Text>
          <Text style={styles.statsText}>Skips: {storage.getNumber('skips') ?? 0}</Text>
        </View>
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
        {/* status */}
        <View style={styles.statusContainer}>
          {isInvalidWord && (<Text style={styles.invalidText}>Invalid word</Text>)}
          {failed && (<Text style={styles.invalidText}>Incorrect! The word was: {wordToGuess}</Text>)}
          {success && (<Text style={styles.successText}>Success!</Text>)}
        </View>

        {/* keyboard */}
          <View style={styles.keyboardRow}>
            {firstRowLetters.map(key => (
              <KeyboardButton
                key={key}
                label={key}
                onPress={() => onPressKey(key)}
                status={isUnused(key) ? 'unused' : isKeyAbsent(key) ? 'absent' : isKeyCorrect(key) ? 'correct' : 'misplaced'}
              />
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {secondRowLetters.map(key => (
              <KeyboardButton
                key={key}
                label={key}
                onPress={() => onPressKey(key)}
                status={isKeyAbsent(key) ? 'absent' : isKeyCorrect(key) ? 'correct' : isUnused(key) ? 'unused' : 'misplaced'}
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
    keyboardContainer: {
    },
    keyboardRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 5,
      marginTop: 10,
      marginHorizontal: 20,
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
    statusContainer: {
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
    statsRow: {
      flexDirection: 'row',
      paddingVertical: 5,
    },
    statsText: {
      color: isDarkMode ? '#a8a8a8' : '#242423',
    },
  });

export default App;
