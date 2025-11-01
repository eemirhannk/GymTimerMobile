import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

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
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderTopColor: colors.border }]}>
      <View style={styles.item}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('totalSets')}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{setCount}</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('workLabel')}</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {setDuration === 0 ? t('timeless') : `${setDuration}s`}
        </Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('restLabel')}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{restDuration}s</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  item: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default React.memo(InfoPanel);
