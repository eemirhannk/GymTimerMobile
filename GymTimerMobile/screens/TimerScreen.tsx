import React, { useMemo, useCallback, useEffect, useRef, memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { calculateProgress } from '../utils/timeFormatter';
import { TimerScreenProps } from '../types';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import { useHaptics } from '../hooks/useHaptics';
import { useTheme } from '../theme/ThemeContext';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { usePremium } from '../hooks/usePremium';
import { useTranslation } from 'react-i18next';
import { WORKOUT } from '../utils/constants';
import TimerHeader from '../components/TimerHeader';
import SetInfo from '../components/SetInfo';
import PhaseBadge from '../components/PhaseBadge';
import TimerCircle from '../components/TimerCircle';
import TimerButton from '../components/TimerButton';
import InfoPanel from '../components/InfoPanel';

const TimerScreen = memo(function TimerScreen({ setCount, setDuration, restDuration, templateSequence, onBack }: TimerScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const { saveWorkout } = useWorkoutHistory();
  const { speakKey, isMuted, toggleMute } = useSpeech();
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
    workoutStartTime,
    currentSetRef, // Ref'i al (unmount'ta güncel değeri almak için)
    workoutStartTimeRef, // Ref'i al (unmount'ta güncel değeri almak için)
    getRestDurationForSet, // Rest duration hesaplama fonksiyonu
    startTimer,
    togglePause,
    resetTimer,
    nextPhase,
  } = useTimer({
    setCount,
    setDuration,
    restDuration,
    templateSequence,
    onPhaseChange: handlePhaseChange,
    onComplete: handleComplete,
  });

  // Rest duration hesapla (template sequence varsa)
  const currentRestDuration = useMemo(() => {
    if (templateSequence && templateSequence.length > 0 && getRestDurationForSet) {
      return getRestDurationForSet(currentSet);
    }
    return restDuration;
  }, [templateSequence, getRestDurationForSet, currentSet, restDuration]);

  // Antrenman kaydı için minimum set sayısı (sadece 5 setten fazla setlik antrenmanlar için)
  
  // Tekrar kayıt oluşturulmasını engellemek için ref kullan
  const workoutSavedRef = useRef(false);
  
  // Geri tuşuna basıldığında kayıt atmamak için flag
  const isBackPressedRef = useRef(false);
  
  // isPremium değerini ref'te tut (unmount'ta closure sorununu önlemek için)
  const isPremiumRef = useRef(isPremium);
  useEffect(() => {
    isPremiumRef.current = isPremium;
  }, [isPremium]);
  
  // Geri tuşuna basıldığında flag'i set et
  const handleBack = useCallback(() => {
    isBackPressedRef.current = true;
    onBack();
  }, [onBack]);
  
  // isEnd state'ini ref'te tut (unmount'ta closure sorununu önlemek için)
  const isEndRef = useRef(isEnd);
  useEffect(() => {
    isEndRef.current = isEnd;
  }, [isEnd]);

  // Ortak kayıt fonksiyonu:
  // - 5 set veya daha az setlik antrenmanlar için: Antrenman sonunda (tamamlandığında) kayıt at
  // - 5 setten fazla setlik antrenmanlar için: 5 set tamamlandıktan sonra 6. sete başladığında kayıt at
  // Ref kullanarak güncel değerleri al (unmount'ta closure sorununu önlemek için)
  const saveWorkoutIfNeeded = useCallback(() => {
    // Ref'lerden güncel değerleri al (unmount'ta closure sorununu önlemek için)
    const currentSetValue = currentSetRef?.current ?? currentSet;
    const workoutStartTimeValue = workoutStartTimeRef?.current ?? workoutStartTime;
    const isPremiumValue = isPremiumRef.current;
    const isEndValue = isEndRef.current;
    
    // Premium kontrolü
    if (!isPremiumValue || workoutStartTimeValue === null || workoutSavedRef.current) {
      return;
    }
    
    // 5 set veya daha az setlik antrenmanlar için: Antrenman sonunda kayıt at
    if (setCount <= WORKOUT.MIN_SETS_FOR_SAVE) {
      // Antrenman tamamlandığında (isEnd true olduğunda) kayıt at
      if (isEndValue) {
        const totalDuration = Math.floor((Date.now() - workoutStartTimeValue) / 1000); // Saniye cinsinden
        const completedSets = setCount; // Tüm setler tamamlanmış
        
        saveWorkout({
          setCount,
          setDuration,
          restDuration,
          totalDuration,
          completedSets,
        });
        
        workoutSavedRef.current = true; // Kayıt oluşturulduğunu işaretle
      }
    } else {
      // 5 setten fazla setlik antrenmanlar için: 5 set tamamlandıktan sonra 6. sete başladığında kayıt at
      // currentSetValue > WORKOUT.MIN_SETS_FOR_SAVE yani 6. sete geçildiğinde
      if (currentSetValue > WORKOUT.MIN_SETS_FOR_SAVE) {
        const totalDuration = Math.floor((Date.now() - workoutStartTimeValue) / 1000); // Saniye cinsinden
        const completedSets = currentSetValue - 1; // Tamamlanan set sayısı (5 set tamamlanmış)
        
        saveWorkout({
          setCount,
          setDuration,
          restDuration,
          totalDuration,
          completedSets,
        });
        
        workoutSavedRef.current = true; // Kayıt oluşturulduğunu işaretle
      }
    }
  }, [currentSet, currentSetRef, workoutStartTimeRef, isEnd, setCount, setDuration, restDuration, saveWorkout]);
  
  useEffect(() => {
    // Reset kayıt durumu timer başladığında
    if (!isEnd && isRunning) {
      workoutSavedRef.current = false;
    }
  }, [isEnd, isRunning]);

  // 1. Timer tamamlandığında kaydet (5 set veya daha az setlik antrenmanlar için)
  useEffect(() => {
    if (isEnd) {
      saveWorkoutIfNeeded();
    }
  }, [isEnd, saveWorkoutIfNeeded]);

  // 2. 5 setten fazla setlik antrenmanlar için: 5 set tamamlandıktan sonra 6. sete başladığında kaydet
  useEffect(() => {
    // Sadece 5 setten fazla setlik antrenmanlar için ve henüz kaydedilmemişse
    if (setCount > WORKOUT.MIN_SETS_FOR_SAVE && !workoutSavedRef.current && currentSet > WORKOUT.MIN_SETS_FOR_SAVE) {
      saveWorkoutIfNeeded();
    }
  }, [currentSet, setCount, saveWorkoutIfNeeded]);

  // 3. Component unmount olduğunda kaydet (uygulama komple kapatıldığında)
  // Geri tuşuna basıldığında kayıt atmayalım (isBackPressedRef kontrolü ile)
  useEffect(() => {
    return () => {
      // Geri tuşuna basılmadıysa kayıt at (uygulama tamamen kapatıldığında)
      if (!isBackPressedRef.current) {
        saveWorkoutIfNeeded();
      }
    };
  }, [saveWorkoutIfNeeded]);

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
    const total = isWorking ? setDuration : currentRestDuration;
    return calculateProgress(timeLeft, total, isWorking, setDuration);
  }, [timeLeft, isWorking, setDuration, currentRestDuration]);

  const showRestart = useMemo(() => currentSet > setCount, [currentSet, setCount]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.timerScrollContent}>
        <TimerHeader
          onBack={handleBack}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
          <View style={styles.cardHeader}>
            <SetInfo 
              currentSet={currentSet} 
              totalSets={setCount}
              isEnd={isEnd}
            />
          </View>
          <PhaseBadge isWorking={isWorking} isEnd={isEnd} />

          <View style={styles.timerContainer}>
            <TimerCircle
              timeLeft={timeLeft}
              progress={progressPercent}
              isWorking={isWorking}
              isRunning={isRunning}
              setDuration={setDuration}
              restDuration={currentRestDuration}
              isEnd={isEnd}
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

                  {!isWorking && currentRestDuration > 0 && (
                    <TimerButton type="finishRest" onPress={handleNextPhase} />
                  )}

                  {!isWorking && currentRestDuration === 0 && (
                    <TimerButton type="next" onPress={handleNextPhase} />
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
            restDuration={currentRestDuration}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default TimerScreen;

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
    position: 'relative',
  },
  cardHeader: {
    alignItems: 'center',
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
