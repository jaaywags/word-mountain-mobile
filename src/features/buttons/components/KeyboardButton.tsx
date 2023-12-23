import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, useColorScheme, useWindowDimensions} from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  isFunctionalKey?: boolean | undefined;
  status: 'absent' | 'misplaced' | 'correct' | 'unused';
};
const KeyboardButton = ({label, onPress, isFunctionalKey, status}: Props) => {
  const { width } = useWindowDimensions();
  const keyWidth = (width - 100) / 9;
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode, keyWidth), [isDarkMode]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.button,
        status === 'absent' ? styles.absentBtn : status === 'misplaced' ? styles.misplacedBtn : status === 'correct' ? styles.correctBtn : styles.unusedBtn,
        isFunctionalKey && styles.functionalButton
      ]}>
      <Text style={[styles.text, isFunctionalKey && styles.functionalText]}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (isDarkMode: boolean, keyWidth: number) =>
  StyleSheet.create({
    button: {
      width: keyWidth,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    functionalButton: {
      width: 50,
    },
    text: {
      color: isDarkMode ? '#424242' : '#b8b8b8',
      fontWeight: '700',
    },
    functionalText: {
      color: isDarkMode ? '#424242' : '#b8b8b8',
      fontWeight: '700',
      fontSize: 10,
    },
    absentBtn: {
      backgroundColor: isDarkMode ? '#000' : '#424242',
    },
    misplacedBtn: {
      backgroundColor: '#ffa200',
    },
    correctBtn: {
      backgroundColor: '#33ba18',
    },
    unusedBtn: {
      backgroundColor: isDarkMode ? '#b8b8b8' : '#424242',
    },
  });

export default KeyboardButton;
