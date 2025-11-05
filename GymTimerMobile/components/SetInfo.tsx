import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type SetInfoProps = {
  currentSet: number;
  totalSets: number;
  isEnd?: boolean;
};

function SetInfo({ currentSet, totalSets, isEnd }: SetInfoProps) {
  const { colors } = useTheme();
  
  // Conditional return hook'lardan sonra olmalı
  if (isEnd) {
    return (
      <View style={styles.container} accessible={true} accessibilityRole="text">
        <Text
          accessible={true}
          accessibilityLabel="Workout Completed"
          accessibilityRole="text"
          style={[styles.completedText, { color: colors.text }]}
        >
          🎉 Tamamlandı!
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container} accessible={true} accessibilityRole="text">
      <Text
        accessible={true}
        accessibilityLabel="Set"
        accessibilityRole="text"
        style={[styles.label, { color: colors.textSecondary }]}
      >
        Set
      </Text>
      <Text
        accessible={true}
        accessibilityLabel={`Set ${currentSet} of ${totalSets}`}
        accessibilityRole="text"
        style={[styles.number, { color: colors.text }]}
      >
        {currentSet} / {totalSets}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default React.memo(SetInfo);
