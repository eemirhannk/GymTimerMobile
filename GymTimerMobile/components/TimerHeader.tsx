import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t('title')}</Text>
      <View style={styles.muteContainer}>
        <TouchableOpacity onPress={onToggleMute}>
          <Text style={styles.backText}>{isMuted ? '🔇' : '🔊'}</Text>
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
    color: '#1F2937',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  muteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default React.memo(TimerHeader);
