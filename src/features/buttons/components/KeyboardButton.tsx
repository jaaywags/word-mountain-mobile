import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, useColorScheme} from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  isFunctionalKey?: boolean | undefined;
};
const KeyboardButton = ({label, onPress, isFunctionalKey}: Props) => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.button, isFunctionalKey && styles.functionalButton]}>
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    button: {
      backgroundColor: isDarkMode ? '#b8b8b8' : '#424242',
      width: 30,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    functionalButton: {
      flexGrow: 1,
    },
    text: {
      color: isDarkMode ? '#424242' : '#b8b8b8',
      fontWeight: '700',
    },
  });

export default KeyboardButton;
