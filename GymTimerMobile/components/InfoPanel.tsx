import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

type InfoPanelProps = {
  setCount: number;
  setDuration: number;
  restDuration: number;
};

function InfoPanel({
  setCount,
  setDuration,
  restDuration,
}: InfoPanelProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>{t('totalSets')}</Text>
        <Text style={styles.value}>{setCount}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>{t('workLabel')}</Text>
        <Text style={styles.value}>
          {setDuration === 0 ? t('timeless') : `${setDuration}s`}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>{t('restLabel')}</Text>
        <Text style={styles.value}>{restDuration}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default React.memo(InfoPanel);
