import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BUTTON_COLORS, BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../utils/constants';
import { useTheme } from '../theme/ThemeContext';

type TimerButtonProps = {
  type: 'start' | 'pause' | 'resume' | 'next' | 'reset' | 'finishSet' | 'finishRest';
  onPress: () => void;
  showRestart?: boolean;
  fullWidth?: boolean;
};

function TimerButton({
  type,
  onPress,
  showRestart = false,
  fullWidth = false,
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
      case 'finishSet':
        return t('finishSet');
      case 'finishRest':
        return t('finishRest');
    }
  }, [type, showRestart, t]);

  const buttonStyle = useMemo(() => [
    styles.button,
    styles[`${type}Button`],
    fullWidth && styles.fullWidthButton
  ], [type, fullWidth]);

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

export default React.memo(TimerButton);

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.LG,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: BUTTON_COLORS.START,
    width: '100%',
  },
  pauseButton: {
    backgroundColor: BUTTON_COLORS.PAUSE,
    width: '50%',
  },
  resumeButton: {
    backgroundColor: BUTTON_COLORS.RESUME,
    width: '50%',
  },
  nextButton: {
    backgroundColor: BUTTON_COLORS.NEXT,
    width: '50%',
  },
  resetButton: {
    backgroundColor: BUTTON_COLORS.RESET,
    width: '50%',
  },
  finishSetButton: {
    backgroundColor: BUTTON_COLORS.FINISH_SET,
    width: '100%',
  },
  finishRestButton: {
    backgroundColor: BUTTON_COLORS.FINISH_REST,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: TYPOGRAPHY.BODY,
    fontWeight: '600',
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
});

