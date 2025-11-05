import React, { useMemo, memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from '../utils/constants';
import { useTheme } from '../theme/ThemeContext';

type TimerButtonProps = {
  type: 'start' | 'pause' | 'resume' | 'next' | 'reset' | 'finishSet' | 'finishRest';
  onPress: () => void;
  showRestart?: boolean;
  fullWidth?: boolean;
};

const TimerButton = memo(function TimerButton({
  type,
  onPress,
  showRestart = false,
  fullWidth = false,
}: TimerButtonProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

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

  const buttonStyle = useMemo(() => {
    const buttonColors: Record<string, string> = {
      start: colors.button.start,
      pause: colors.button.pause,
      resume: colors.button.resume,
      next: colors.button.next,
      reset: colors.button.reset,
      finishSet: colors.button.finishSet,
      finishRest: colors.button.finishRest,
    };

    const widthStyles: Record<string, { width: string }> = {
      start: { width: '100%' },
      pause: { width: '50%' },
      resume: { width: '50%' },
      next: { width: '50%' },
      reset: { width: '50%' },
      finishSet: { width: '100%' },
      finishRest: { width: '100%' },
    };

    return [
      styles.button,
      { backgroundColor: buttonColors[type] },
      widthStyles[type],
      fullWidth && styles.fullWidthButton
    ];
  }, [type, fullWidth, colors.button]);

  const accessibilityLabel = useMemo(() => {
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

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityHint={
        type === 'start' ? t('start') + ' timer' :
        type === 'pause' ? t('pause') + ' timer' :
        type === 'resume' ? t('resume') + ' timer' :
        type === 'reset' ? t('reset') + ' timer' :
        type === 'next' ? t('nextRest') :
        type === 'finishSet' ? t('finishSet') :
        t('finishRest')
      }
      style={buttonStyle}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
});

export default TimerButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.LG,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
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

