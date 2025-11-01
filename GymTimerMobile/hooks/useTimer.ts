import { useState, useEffect, useRef, useCallback } from 'react';
import { TIMER } from '../utils/constants';
import { useAppStateSync } from './useAppStateSync';

type UseTimerParams = {
  setCount: number;
  setDuration: number;
  restDuration: number;
  onPhaseChange?: (phase: 'work' | 'rest', setNumber: number) => void;
  onComplete?: () => void;
};

type TimerState = {
  currentSet: number;
  isWorking: boolean;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isEnd: boolean;
};

type TimerControls = {
  startTimer: () => void;
  togglePause: () => void;
  resetTimer: () => void;
  nextPhase: () => void;
};

export const useTimer = ({
  setCount,
  setDuration,
  restDuration,
  onPhaseChange,
  onComplete,
}: UseTimerParams): TimerState & TimerControls => {
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(setDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(setDuration);
  const isWorkingRef = useRef(true);
  const currentSetRef = useRef(1);
  const isRunningRef = useRef(false);

  const clearIntervalFn = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleTimeEnd = useCallback(() => {
    clearIntervalFn();

    if (isWorkingRef.current) {
      if (currentSetRef.current < setCount) {
        isWorkingRef.current = false;
        setIsWorking(false);
        timeLeftRef.current = restDuration;
        setTimeLeft(restDuration);
        onPhaseChange?.('rest', currentSetRef.current);
        // startInterval'ı aşağıda tanımlayacağız, bu yüzden burada referansını saklayacağız
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        setIsEnd(true);
        onComplete?.();
        return;
      }
    } else {
      currentSetRef.current++;
      setCurrentSet(currentSetRef.current);
      isWorkingRef.current = true;
      setIsWorking(true);
      timeLeftRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChange?.('work', currentSetRef.current);
    }

    // Interval'ı yeniden başlat (eğer gerekirse)
    if (setDuration === 0 && isWorkingRef.current) {
      return;
    }
    clearIntervalFn();
    intervalRef.current = setInterval(() => {
      if (timeLeftRef.current > 0) {
        timeLeftRef.current--;
        setTimeLeft(timeLeftRef.current);
      } else {
        handleTimeEnd();
      }
    }, TIMER.INTERVAL_MS);
  }, [setCount, restDuration, setDuration, setTimeLeft, setIsWorking, setCurrentSet, setIsRunning, setIsEnd, onPhaseChange, onComplete, clearIntervalFn]);

  const startInterval = useCallback(() => {
    if (setDuration === 0 && isWorkingRef.current) {
      return;
    }
    clearIntervalFn();
    intervalRef.current = setInterval(() => {
      if (timeLeftRef.current > 0) {
        timeLeftRef.current--;
        setTimeLeft(timeLeftRef.current);
      } else {
        handleTimeEnd();
      }
    }, TIMER.INTERVAL_MS);
  }, [setDuration, setTimeLeft, handleTimeEnd, clearIntervalFn]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    isRunningRef.current = true;
    setIsPaused(false);

    if (isWorkingRef.current) {
      timeLeftRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChange?.('work', currentSetRef.current);
    } else {
      timeLeftRef.current = restDuration;
      setTimeLeft(restDuration);
      onPhaseChange?.('rest', currentSetRef.current);
    }

    startInterval();
  }, [setDuration, restDuration, onPhaseChange, startInterval, setTimeLeft]);

  const nextPhase = useCallback(() => {
    clearIntervalFn();

    if (isWorking) {
      if (currentSet < setCount) {
        setIsWorking(false);
        isWorkingRef.current = false;
        timeLeftRef.current = restDuration;
        setTimeLeft(restDuration);
        onPhaseChange?.('rest', currentSet);
        startInterval();
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        setIsEnd(true);
        onComplete?.();
      }
    } else {
      const nextSet = currentSet + 1;
      setCurrentSet(nextSet);
      currentSetRef.current = nextSet;
      setIsWorking(true);
      isWorkingRef.current = true;
      timeLeftRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChange?.('work', nextSet);
      if (setDuration > 0) {
        startInterval();
      }
    }
  }, [isWorking, currentSet, setCount, setDuration, restDuration, setTimeLeft, setIsWorking, setCurrentSet, setIsRunning, setIsEnd, onPhaseChange, onComplete, clearIntervalFn, startInterval]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      startInterval();
    } else {
      setIsPaused(true);
      clearIntervalFn();
    }
  }, [isPaused, startInterval, clearIntervalFn]);

  const resetTimer = useCallback(() => {
    clearIntervalFn();
    currentSetRef.current = 1;
    setCurrentSet(1);
    isWorkingRef.current = true;
    setIsWorking(true);
    timeLeftRef.current = 0;
    setTimeLeft(0);
    setIsRunning(false);
    isRunningRef.current = false;
    setIsPaused(false);
    setIsEnd(false);
  }, [setCurrentSet, setIsWorking, setTimeLeft, setIsRunning, setIsPaused, setIsEnd, clearIntervalFn]);

  // setDuration değiştiğinde timeLeft'i güncelle
  useEffect(() => {
    if (setDuration > 0) {
      timeLeftRef.current = setDuration;
      setTimeLeft(setDuration);
    }
  }, [setDuration, setTimeLeft]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      clearIntervalFn();
    };
  }, [clearIntervalFn]);

  // AppState ile arka plana gidip gelince geçen zamanı telafi et
  useAppStateSync({
    isRunning: isRunningRef.current,
    isPaused,
    isEnd,
    timeLeftRef,
    isWorkingRef,
    currentSetRef,
    setCount,
    setDuration,
    restDuration,
    setTimeLeft,
    setIsWorking,
    setCurrentSet,
    setIsRunning,
    setIsEnd,
    startInterval,
    clearInterval: clearIntervalFn,
  });

  return {
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
  };
};

