import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type SetInfoProps = {
  currentSet: number;
  totalSets: number;
};

function SetInfo({ currentSet, totalSets }: SetInfoProps) {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Set</Text>
      <Text style={[styles.number, { color: colors.text }]}>
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
});

export default React.memo(SetInfo);
