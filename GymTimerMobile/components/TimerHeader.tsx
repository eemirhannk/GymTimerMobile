import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

type TimerHeaderProps = {
  onBack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
};

function TimerHeader({
  onBack,
  isMuted,
  onToggleMute,
}: TimerHeaderProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={t('back')}
        accessibilityRole="button"
        accessibilityHint={t('back') + ' - ' + t('title')}
        onPress={onBack}
      >
        <Text style={[styles.backText, { color: colors.text }]}>←</Text>
      </TouchableOpacity>
      <Text 
        accessible={true}
        accessibilityRole="header"
        style={[styles.title, { color: colors.text }]}
      >
        {t('title')}
      </Text>
      <View style={styles.muteContainer}>
        <TouchableOpacity
          accessible={true}
          accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
          accessibilityRole="button"
          accessibilityHint={isMuted ? 'Unmute sound' : 'Mute sound'}
          accessibilityState={{ checked: isMuted }}
          onPress={onToggleMute}
        >
          <Text style={[styles.backText, { color: colors.text }]}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  muteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default React.memo(TimerHeader);
