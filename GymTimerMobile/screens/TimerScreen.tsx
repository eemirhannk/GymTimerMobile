import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calculateProgress } from '../utils/timeFormatter';
import { TimerScreenProps } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import TimerHeader from '../components/TimerHeader';
import SetInfo from '../components/SetInfo';
import PhaseBadge from '../components/PhaseBadge';
import TimerCircle from '../components/TimerCircle';
import TimerButton from '../components/TimerButton';
import InfoPanel from '../components/InfoPanel';

export default function TimerScreen({ setCount, setDuration, restDuration, onBack }: TimerScreenProps) {
  const { speakKey, isMuted, toggleMute } = useSpeech();

  const handlePhaseChange = useCallback((phase: 'work' | 'rest', setNumber: number) => {
    if (phase === 'work') {
      speakKey('setWork', setNumber);
    } else {
      speakKey('rest');
    }
  }, [speakKey]);

  const handleComplete = useCallback(() => {
    speakKey('congrats');
  }, [speakKey]);

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

  const progressPercent = useMemo(() => {
    const total = isWorking ? setDuration : restDuration;
    return calculateProgress(timeLeft, total, isWorking, setDuration);
  }, [timeLeft, isWorking, setDuration, restDuration]);

  const showRestart = useMemo(() => currentSet > setCount, [currentSet, setCount]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.timerScrollContent}>
        <TimerHeader
          onBack={onBack}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <View style={styles.card}>
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
                onPress={startTimer}
                showRestart={showRestart}
              />
            )}

            {isRunning && !(setDuration === 0 && isWorking) && !isEnd && (
              <TimerButton
                type={isPaused ? 'resume' : 'pause'}
                onPress={togglePause}
              />
            )}

            {isRunning && setDuration === 0 && isWorking && !isEnd && (
              <TimerButton type="next" onPress={nextPhase} />
            )}

            {(isRunning || isEnd) && (
              <TimerButton type="reset" onPress={resetTimer} />
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
    backgroundColor: '#F3F4F6',
  },
  timerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timerContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
});
