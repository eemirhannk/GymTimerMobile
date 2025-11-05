import { useState, useEffect, useRef, useCallback } from 'react';
import { TIMER } from '../utils/constants';
import { useAppStateSync } from './useAppStateSync';

type TemplateSequenceItem = {
  setCount: number;
  setDuration: number;
  restDuration: number;
};

type UseTimerParams = {
  setCount: number;
  setDuration: number;
  restDuration: number;
  templateSequence?: TemplateSequenceItem[]; // Şablon dizisi (program için)
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
  workoutStartTime: number | null;
  currentSetRef: React.MutableRefObject<number>;
  workoutStartTimeRef: React.MutableRefObject<number | null>;
  getRestDurationForSet: (setNumber: number) => number;
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
  templateSequence,
  onPhaseChange,
  onComplete,
}: UseTimerParams): TimerState & TimerControls => {
  const [currentSet, setCurrentSet] = useState(1);
  const [isWorking, setIsWorking] = useState(true);
  const [timeLeft, setTimeLeft] = useState(setDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  // Template sequence varsa, set numarasına göre rest duration'ı belirle
  const getRestDurationForSet = useCallback((setNumber: number): number => {
    if (!templateSequence || templateSequence.length === 0) {
      return restDuration; // Template sequence yoksa rest duration kullan
    }

    let currentSetIndex = 0;
    let setOffset = 0;

    // Hangi template'in kullanılacağını bul
    for (let i = 0; i < templateSequence.length; i++) {
      const template = templateSequence[i];
      if (setNumber <= setOffset + template.setCount) {
        currentSetIndex = i;
        break;
      }
      setOffset += template.setCount;
    }

    return templateSequence[currentSetIndex].restDuration;
  }, [templateSequence]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef = useRef(setDuration);
  const isWorkingRef = useRef(true);
  const currentSetRef = useRef(1);
  const isRunningRef = useRef(false);
  
  // Timer precision için başlangıç zamanı
  const startTimeRef = useRef<number | null>(null);
  const initialDurationRef = useRef<number>(setDuration);
  
  // Antrenman başlangıç zamanı (toplam süre hesaplamak için)
  const workoutStartTimeRef = useRef<number | null>(null);
  
  // Callback'leri ref'lerde sakla (dependency array'i küçültmek için)
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onCompleteRef = useRef(onComplete);
  
  // Callback ref'lerini güncelle
  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
    onCompleteRef.current = onComplete;
  }, [onPhaseChange, onComplete]);

  const clearIntervalFn = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleTimeEnd = useCallback(() => {
    clearIntervalFn();
    startTimeRef.current = null; // Timer precision reset

    if (isWorkingRef.current) {
      if (currentSetRef.current < setCount) {
        isWorkingRef.current = false;
        setIsWorking(false);
        // Set numarasına göre rest duration'ı belirle (template sequence varsa, yoksa rest duration)
        let currentRestDuration: number;
        if (templateSequence && templateSequence.length > 0) {
          currentRestDuration = getRestDurationForSet(currentSetRef.current);
        } else {
          currentRestDuration = restDuration;
        }
        timeLeftRef.current = currentRestDuration;
        initialDurationRef.current = currentRestDuration;
        setTimeLeft(currentRestDuration);
        onPhaseChangeRef.current?.('rest', currentSetRef.current);
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        setIsEnd(true);
        // Timer bittiğinde sıfırla
        timeLeftRef.current = 0;
        setTimeLeft(0);
        initialDurationRef.current = 0;
        clearIntervalFn();
        startTimeRef.current = null;
        onCompleteRef.current?.();
        return;
      }
    } else {
      currentSetRef.current++;
      setCurrentSet(currentSetRef.current);
      isWorkingRef.current = true;
      setIsWorking(true);
      timeLeftRef.current = setDuration;
      initialDurationRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChangeRef.current?.('work', currentSetRef.current);
    }

    // Interval'ı yeniden başlat (eğer gerekirse)
    if (isWorkingRef.current && setDuration === 0) {
      // Süresiz çalışma fazında interval başlatma
      return;
    }
    if (!isWorkingRef.current) {
      // Dinlenme fazında rest duration'ı kontrol et (template sequence varsa, yoksa rest duration)
      let currentRestDuration: number;
      if (templateSequence && templateSequence.length > 0) {
        currentRestDuration = getRestDurationForSet(currentSetRef.current);
      } else {
        currentRestDuration = restDuration;
      }
      if (currentRestDuration === 0) {
        // Dinlenme süresi süresiz ise interval başlatma
        return;
      }
    }
    // Yeni interval başlat (startInterval otomatik olarak precision'ı ayarlar)
    startInterval();
  }, [setTimeLeft, setIsWorking, setCurrentSet, setIsRunning, setIsEnd, clearIntervalFn, startInterval, getRestDurationForSet, setCount, setDuration, restDuration, templateSequence]);

  const startInterval = useCallback(() => {
    if (setDuration === 0 && isWorkingRef.current) {
      return;
    }
    // Interval zaten varsa temizle, yoksa direkt başlat
    if (intervalRef.current) {
      clearIntervalFn();
    }
    
    // Timer precision: Başlangıç zamanını kaydet
    startTimeRef.current = Date.now();
    initialDurationRef.current = timeLeftRef.current;
    
    intervalRef.current = setInterval(() => {
      // Date.now() tabanlı daha hassas hesaplama
      if (startTimeRef.current !== null) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const calculatedTimeLeft = Math.max(0, initialDurationRef.current - elapsed);
        
        if (calculatedTimeLeft !== timeLeftRef.current) {
          timeLeftRef.current = calculatedTimeLeft;
          setTimeLeft(calculatedTimeLeft);
        }
        
        if (calculatedTimeLeft === 0) {
          handleTimeEnd();
        }
      } else {
        // Fallback: Eski yöntem (startTimeRef null ise)
        if (timeLeftRef.current > 0) {
          timeLeftRef.current--;
          setTimeLeft(timeLeftRef.current);
        } else {
          handleTimeEnd();
        }
      }
    }, TIMER.INTERVAL_MS);
  }, [setTimeLeft, handleTimeEnd, clearIntervalFn, setDuration]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    isRunningRef.current = true;
    setIsPaused(false);
    
    // Antrenman başlangıç zamanını kaydet (sadece ilk başlatmada)
    if (workoutStartTimeRef.current === null) {
      workoutStartTimeRef.current = Date.now();
    }

    if (isWorkingRef.current) {
      timeLeftRef.current = setDuration;
      initialDurationRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChangeRef.current?.('work', currentSetRef.current);
    } else {
      // Set numarasına göre rest duration'ı belirle (template sequence varsa, yoksa rest duration)
      let currentRestDuration: number;
      if (templateSequence && templateSequence.length > 0) {
        currentRestDuration = getRestDurationForSet(currentSetRef.current);
      } else {
        currentRestDuration = restDuration;
      }
      timeLeftRef.current = currentRestDuration;
      initialDurationRef.current = currentRestDuration;
      setTimeLeft(currentRestDuration);
      onPhaseChangeRef.current?.('rest', currentSetRef.current);
    }

    startInterval();
  }, [startInterval, setTimeLeft, getRestDurationForSet, templateSequence, setDuration, restDuration]);

  const nextPhase = useCallback(() => {
    clearIntervalFn();
    startTimeRef.current = null; // Timer precision reset

    if (isWorking) {
      if (currentSet < setCount) {
        setIsWorking(false);
        isWorkingRef.current = false;
        // Set numarasına göre rest duration'ı belirle (template sequence varsa, yoksa rest duration)
        let currentRestDuration: number;
        if (templateSequence && templateSequence.length > 0) {
          currentRestDuration = getRestDurationForSet(currentSet);
        } else {
          currentRestDuration = restDuration;
        }
        timeLeftRef.current = currentRestDuration;
        initialDurationRef.current = currentRestDuration;
        setTimeLeft(currentRestDuration);
        onPhaseChangeRef.current?.('rest', currentSet);
        startInterval();
      } else {
        setIsRunning(false);
        isRunningRef.current = false;
        setIsEnd(true);
        // Timer bittiğinde sıfırla
        timeLeftRef.current = 0;
        setTimeLeft(0);
        initialDurationRef.current = 0;
        clearIntervalFn();
        startTimeRef.current = null;
        onCompleteRef.current?.();
      }
    } else {
      const nextSet = currentSet + 1;
      setCurrentSet(nextSet);
      currentSetRef.current = nextSet;
      setIsWorking(true);
      isWorkingRef.current = true;
      timeLeftRef.current = setDuration;
      initialDurationRef.current = setDuration;
      setTimeLeft(setDuration);
      onPhaseChangeRef.current?.('work', nextSet);
      if (setDuration > 0) {
        startInterval();
      }
    }
  }, [isWorking, currentSet, setTimeLeft, setIsWorking, setCurrentSet, setIsRunning, setIsEnd, clearIntervalFn, startInterval, getRestDurationForSet, templateSequence, setCount, setDuration, restDuration]);

  const togglePause = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      // Pause'tan devam ederken kalan süreyi koru ve timer'ı başlat
      initialDurationRef.current = timeLeftRef.current;
      startInterval();
    } else {
      setIsPaused(true);
      clearIntervalFn();
      startTimeRef.current = null; // Timer precision reset
    }
  }, [isPaused, startInterval, clearIntervalFn]);

  const resetTimer = useCallback(() => {
    clearIntervalFn();
    startTimeRef.current = null; // Timer precision reset
    workoutStartTimeRef.current = null; // Antrenman başlangıç zamanını sıfırla
    currentSetRef.current = 1;
    setCurrentSet(1);
    isWorkingRef.current = true;
    setIsWorking(true);
    timeLeftRef.current = 0;
    initialDurationRef.current = 0;
    setTimeLeft(0);
    setIsRunning(false);
    isRunningRef.current = false;
    setIsPaused(false);
    setIsEnd(false);
  }, [setCurrentSet, setIsWorking, setTimeLeft, setIsRunning, setIsPaused, setIsEnd, clearIntervalFn]);

  // setDuration değiştiğinde timeLeft'i güncelle (sadece çalışma fazındayken ve timer çalışmıyorken)
  useEffect(() => {
    if (setDuration > 0 && isWorkingRef.current && !isRunningRef.current) {
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
    templateSequence,
    getRestDurationForSet,
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
    workoutStartTime: workoutStartTimeRef.current,
    currentSetRef, // Ref'i de export et (unmount'ta güncel değeri almak için)
    workoutStartTimeRef, // Ref'i de export et (unmount'ta güncel değeri almak için)
    getRestDurationForSet, // Rest duration hesaplama fonksiyonunu export et
    startTimer,
    togglePause,
    resetTimer,
    nextPhase,
  };
};

