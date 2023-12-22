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
import AllKnownEnglishWords from '@features/dictionary/data/AllKnownEnglishWords';

const App = () => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);
  const { wordToGuess, refreshWord } = useWordToGuess();
  const [guessCount, setGuessCount] = useState(0);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [currentWordLetters, setCurrentWordLetters] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isInvalidWord, setIsInvalidWord] = useState(false);

  const firstRowLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const secondRowLetters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const thirdRowLetters = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

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

    if (AllKnownEnglishWords.findIndex(word => word.toUpperCase() === currentWordLetters.join('')) < 0) {
      setIsInvalidWord(true);
      return;
    }

    if (currentWordLetters.join('').toUpperCase() === wordToGuess.toUpperCase()) {
      setSuccess(true);
      return;
    }

    setGuesses([...guesses, [...currentWordLetters]]);
    setCurrentWordLetters([]);
    if (guessCount === 5) {
      setFailed(true);
      return;
    }

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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>WORD MOUNTAIN</Text>
        <TouchableOpacity
          onPress={onReset}
          activeOpacity={0.7}
          style={styles.resetBtn}
        >
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.allGuessesContainer}>
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
          <View style={styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[0] ?? ''}</Text>
          </View>
          <View style={styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[1] ?? ''}</Text>
          </View>
          <View style={styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[2] ?? ''}</Text>
          </View>
          <View style={styles.letterContainer}>
            <Text style={styles.letter}>{currentWordLetters?.[3] ?? ''}</Text>
          </View>
          <View style={styles.letterContainer}>
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

      {/* status */}
      <View style={styles.statusContainer}>
        {isInvalidWord && (<Text style={styles.invalidText}>Invalid word</Text>)}
        {failed && (<Text style={styles.invalidText}>Incorrect! The word was: {wordToGuess}</Text>)}
        {success && (<Text style={styles.successText}>Success!</Text>)}
      </View>

      {/* keyboard */}
      <View style={styles.keyboardContainer}>
        <View style={styles.keyboardRow}>
          {firstRowLetters.map(key => (
            <KeyboardButton
              key={key}
              label={key}
              onPress={() => onPressKey(key)}
            />
          ))}
        </View>
        <View style={styles.keyboardRow}>
          {secondRowLetters.map(key => (
            <KeyboardButton
              key={key}
              label={key}
              onPress={() => onPressKey(key)}
            />
          ))}
        </View>
        <View style={styles.keyboardRow}>
          <KeyboardButton
            label='BACK'
            onPress={onBackspace}
            isFunctionalKey={true}
            />
          {thirdRowLetters.map(key => (
            <KeyboardButton
              key={key}
              label={key}
              onPress={() => onPressKey(key)}
            />
          ))}
          <KeyboardButton
            label='ENTER'
            onPress={onEnter}
            isFunctionalKey={true}
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
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 60,
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
      width: '100%',
      marginBottom: 40,
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
    },
    misplacedText: {
      color: '#424242',
    },
    correctText: {
      color: '#424242',
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
    allGuessesContainer: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  });

export default App;
