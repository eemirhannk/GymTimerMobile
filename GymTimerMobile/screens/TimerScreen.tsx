import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { calculateProgress } from '../utils/timeFormatter';
import { TimerScreenProps } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import { useHaptics } from '../hooks/useHaptics';
import { useTheme } from '../theme/ThemeContext';
import TimerHeader from '../components/TimerHeader';
import SetInfo from '../components/SetInfo';
import PhaseBadge from '../components/PhaseBadge';
import TimerCircle from '../components/TimerCircle';
import TimerButton from '../components/TimerButton';
import InfoPanel from '../components/InfoPanel';

export default function TimerScreen({ setCount, setDuration, restDuration, soundMode, onBack }: TimerScreenProps) {
  const { colors } = useTheme();
  const { speakKey, isMuted, toggleMute } = useSpeech(soundMode);
  const { triggerImpact, triggerNotification, triggerSelection } = useHaptics();

  const handlePhaseChange = useCallback((phase: 'work' | 'rest', setNumber: number) => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Heavy);
    if (phase === 'work') {
      speakKey('setWork', setNumber);
    } else {
      speakKey('rest');
    }
  }, [speakKey, triggerImpact]);

  const handleComplete = useCallback(() => {
    triggerNotification('success');
    speakKey('congrats');
  }, [speakKey, triggerNotification]);

  const {
    currentSet,
    isWorking,
    timeLeft,
    isRunning,
    isPaused,
    isEnd,
    startTimer,
    togglePause,
    resetTimer,
    nextPhase,
  } = useTimer({
    setCount,
    setDuration,
    restDuration,
    onPhaseChange: handlePhaseChange,
    onComplete: handleComplete,
  });

  const handleStartTimer = useCallback(() => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    startTimer();
  }, [startTimer, triggerImpact]);

  const handleTogglePause = useCallback(() => {
    triggerSelection();
    togglePause();
  }, [togglePause, triggerSelection]);

  const handleResetTimer = useCallback(() => {
    triggerSelection();
    resetTimer();
  }, [resetTimer, triggerSelection]);

  const handleNextPhase = useCallback(() => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    nextPhase();
  }, [nextPhase, triggerImpact]);

  const progressPercent = useMemo(() => {
    const total = isWorking ? setDuration : restDuration;
    return calculateProgress(timeLeft, total, isWorking, setDuration);
  }, [timeLeft, isWorking, setDuration, restDuration]);

  const showRestart = useMemo(() => currentSet > setCount, [currentSet, setCount]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.timerScrollContent}>
        <TimerHeader
          onBack={onBack}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
          <SetInfo currentSet={currentSet} totalSets={setCount} />
          <PhaseBadge isWorking={isWorking} />

          <View style={styles.timerContainer}>
            <TimerCircle
              timeLeft={timeLeft}
              progress={progressPercent}
              isWorking={isWorking}
              isRunning={isRunning}
              setDuration={setDuration}
              restDuration={restDuration}
            />
          </View>

          <View style={styles.buttonContainer}>
            {!isRunning && !isEnd && (
              <TimerButton
                type="start"
                onPress={handleStartTimer}
                showRestart={showRestart}
              />
            )}

            {isRunning && !isEnd && (
              <>
                <View style={styles.buttonRow}>
                  {!(setDuration === 0 && isWorking) && (
                    <TimerButton
                      type={isPaused ? 'resume' : 'pause'}
                      onPress={handleTogglePause}
                    />
                  )}

                  {setDuration === 0 && isWorking && (
                    <TimerButton type="next" onPress={handleNextPhase} />
                  )}

                  <TimerButton type="reset" onPress={handleResetTimer} />
                </View>

                <View style={styles.buttonRow}>
                  {isWorking && setDuration > 0 && (
                    <TimerButton type="finishSet" onPress={handleNextPhase} />
                  )}

                  {!isWorking && (
                    <TimerButton type="finishRest" onPress={handleNextPhase} />
                  )}
                </View>
              </>
            )}

            {isEnd && (
              <TimerButton type="reset" onPress={handleResetTimer} fullWidth={true} />
            )}
          </View>

          <InfoPanel
            setCount={setCount}
            setDuration={setDuration}
            restDuration={restDuration}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 24,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  timerContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
});
