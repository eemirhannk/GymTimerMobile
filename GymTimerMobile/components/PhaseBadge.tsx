import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

type PhaseBadgeProps = {
  isWorking: boolean;
};

function PhaseBadge({ isWorking }: PhaseBadgeProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          isWorking ? styles.workingBadge : styles.restBadge,
        ]}
      >
        <Text
          style={[
            styles.text,
            isWorking ? styles.workingText : styles.restText,
          ]}
        >
          {isWorking ? t('workTime') : t('restTime')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
  },
  workingBadge: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  restBadge: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  workingText: {
    color: '#166534',
  },
  restText: {
    color: '#1E40AF',
  },
});

export default React.memo(PhaseBadge);
