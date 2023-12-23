import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { storage } from '@features/mmkv/storage';

const OverallScore = () => {
  const isDarkMode = true; //useColorScheme() === 'dark';
  const styles = useMemo(() => createStyles(isDarkMode), [isDarkMode]);

  return (
    <View style={styles.statsRow}>
      <Text style={styles.statsText}>Wins: {storage.getNumber('wins') ?? 0},{' '}</Text>
      <Text style={styles.statsText}>Loses: {storage.getNumber('loses') ?? 0},{' '}</Text>
      <Text style={styles.statsText}>Skips: {storage.getNumber('skips') ?? 0}</Text>
    </View>
  );
};

const createStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      paddingVertical: 5,
    },
    statsText: {
      color: isDarkMode ? '#a8a8a8' : '#242423',
    },
  });
export default OverallScore;