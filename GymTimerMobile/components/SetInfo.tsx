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
});

export default React.memo(SetInfo);
