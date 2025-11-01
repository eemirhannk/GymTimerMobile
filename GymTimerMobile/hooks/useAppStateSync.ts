import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

type UseAppStateSyncParams = {
  isRunning: boolean;
  isPaused: boolean;
  isEnd: boolean;
  timeLeftRef: React.MutableRefObject<number>;
  isWorkingRef: React.MutableRefObject<boolean>;
  currentSetRef: React.MutableRefObject<number>;
  setCount: number;
  setDuration: number;
  restDuration: number;
  setTimeLeft: (value: number) => void;
  setIsWorking: (value: boolean) => void;
  setCurrentSet: (value: number) => void;
  setIsRunning: (value: boolean) => void;
  setIsEnd: (value: boolean) => void;
  startInterval: () => void;
  clearInterval: () => void;
};

export const useAppStateSync = ({
  isRunning,
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
  clearInterval,
}: UseAppStateSyncParams) => {
  const lastTimestampRef = useRef<number | null>(null);
  const wasRunningRef = useRef(false);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        lastTimestampRef.current = Date.now();
        wasRunningRef.current = isRunning && !isPaused && !isEnd;
        return;
      }
      if (state === 'active') {
        if (!wasRunningRef.current || lastTimestampRef.current == null) return;

        // Interval varsa durdur, hesap sonrası tekrar başlatacağız
        clearInterval();

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
        if (!isEnd && isRunning && !(isWorkingRef.current && setDuration === 0)) {
          startInterval();
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, [isPaused, isEnd, restDuration, setDuration, setCount, isRunning]);
};

