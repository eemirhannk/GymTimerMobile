import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

type TimerButtonProps = {
  type: 'start' | 'pause' | 'resume' | 'next' | 'reset';
  onPress: () => void;
  showRestart?: boolean;
};

function TimerButton({
  type,
  onPress,
  showRestart = false,
}: TimerButtonProps) {
  const { t } = useTranslation();

  const buttonText = useMemo(() => {
    switch (type) {
      case 'start':
        return showRestart ? t('restart') : t('start');
      case 'pause':
        return t('pause');
      case 'resume':
        return t('resume');
      case 'next':
        return t('nextRest');
      case 'reset':
        return t('reset');
    }
  }, [type, showRestart, t]);

  const buttonStyle = useMemo(() => [styles.button, styles[`${type}Button`]], [type]);

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(TimerButton);

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#059669',
    width: '100%',
  },
  pauseButton: {
    backgroundColor: '#D97706',
    width: '50%',
  },
  resumeButton: {
    backgroundColor: '#059669',
    width: '50%',
  },
  nextButton: {
    backgroundColor: '#7C3AED',
    width: '50%',
  },
  resetButton: {
    backgroundColor: '#DC2626',
    width: '50%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

