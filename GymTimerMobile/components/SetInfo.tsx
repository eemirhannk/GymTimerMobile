import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SetInfoProps = {
  currentSet: number;
  totalSets: number;
};

function SetInfo({ currentSet, totalSets }: SetInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set</Text>
      <Text style={styles.number}>
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
    color: '#6B7280',
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export default React.memo(SetInfo);
