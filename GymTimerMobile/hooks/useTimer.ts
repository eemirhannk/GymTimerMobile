import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';

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
  const lastTimestampRef = useRef<number | null>(null);
  const wasRunningRef = useRef(false);

  const startInterval = () => {
    if (setDuration === 0 && isWorkingRef.current) {
      return;
    }
    intervalRef.current = setInterval(() => {
      if (timeLeftRef.current > 0) {
        timeLeftRef.current--;
        setTimeLeft(timeLeftRef.current);
      } else {
        handleTimeEnd();
      }
    }, 1000);
  };

  const handleTimeEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isWorkingRef.current) {
      if (currentSetRef.current < setCount) {
        isWorkingRef.current = false;
        setIsWorking(false);
        timeLeftRef.current = restDuration;
        setTimeLeft(restDuration);
        onPhaseChange?.('rest', currentSetRef.current);
        startInterval();
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        setIsEnd(true);
        onComplete?.();
      }
    } else {
      currentSetRef.current++;
      setCurrentSet(currentSetRef.current);
      isWorkingRef.current = true;
      setIsWorking(true);
      timeLeftRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChange?.('work', currentSetRef.current);
      startInterval();
    }
  };

  const startTimer = () => {
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
  };

  const nextPhase = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
  };

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      startInterval();
    } else {
      setIsPaused(true);
      wasRunningRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
  };

  // setDuration değiştiğinde timeLeft'i güncelle
  useEffect(() => {
    if (setDuration > 0) {
      timeLeftRef.current = setDuration;
      setTimeLeft(setDuration);
    }
  }, [setDuration]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // AppState ile arka plana gidip gelince geçen zamanı telafi et
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        lastTimestampRef.current = Date.now();
        wasRunningRef.current = isRunningRef.current && !isPaused && !isEnd;
        return;
      }
      if (state === 'active') {
        if (!wasRunningRef.current || lastTimestampRef.current == null) return;

        // Interval varsa durdur, hesap sonrası tekrar başlatacağız
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        const now = Date.now();
        let delta = Math.floor((now - lastTimestampRef.current) / 1000);
        lastTimestampRef.current = null;

        // Geçen süreyi uygula: fazlar arası geçişleri de hesaba kat
        while (delta > 0 && !isEnd) {
          const totalCurrent = isWorkingRef.current ? (setDuration || 0) : restDuration;
          // Süresiz çalışma ise sadece dinlenmede telafi uygularız
          if (isWorkingRef.current && setDuration === 0) {
            break;
          }
          const need = timeLeftRef.current;
          if (delta < need) {
            timeLeftRef.current = need - delta;
            setTimeLeft(timeLeftRef.current);
            delta = 0;
          } else {
            // Bu faz bitiyor
            delta -= need;
            timeLeftRef.current = 0;
            setTimeLeft(0);
            // Faz sonu mantığını manuel ilerlet
            if (isWorkingRef.current) {
              if (currentSetRef.current < setCount) {
                isWorkingRef.current = false;
                setIsWorking(false);
                timeLeftRef.current = restDuration;
                setTimeLeft(restDuration);
              } else {
                setIsRunning(false);
                isRunningRef.current = false;
                setIsEnd(true);
                break;
              }
            } else {
              currentSetRef.current += 1;
              setCurrentSet(currentSetRef.current);
              isWorkingRef.current = true;
              setIsWorking(true);
              timeLeftRef.current = setDuration;
              setTimeLeft(setDuration);
              if (setDuration === 0) {
                // Süresiz çalışma fazına gelindiyse daha fazla otomatik akış yok
                break;
              }
            }
          }
        }

        // Bitti değilse interval'i yeniden başlat
        if (!isEnd && isRunningRef.current && !(isWorkingRef.current && setDuration === 0)) {
          startInterval();
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, [isPaused, isEnd, restDuration, setDuration, setCount]);

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

