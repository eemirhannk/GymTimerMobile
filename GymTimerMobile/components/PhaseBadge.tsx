import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

type PhaseBadgeProps = {
  isWorking: boolean;
};

function PhaseBadge({ isWorking }: PhaseBadgeProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const badgeStyle = useMemo(() => [
    styles.badge,
    {
      backgroundColor: isWorking ? colors.workingBadge.bg : colors.restBadge.bg,
      borderColor: isWorking ? colors.workingBadge.border : colors.restBadge.border,
    }
  ], [isWorking, colors]);

  const textStyle = useMemo(() => [
    styles.text,
    { color: isWorking ? colors.workingBadge.text : colors.restBadge.text }
  ], [isWorking, colors]);

  return (
    <View style={styles.container}>
      <View style={badgeStyle}>
        <Text style={textStyle}>
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
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default React.memo(PhaseBadge);
