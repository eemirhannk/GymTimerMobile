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

type BackgroundSnapshot = {
  timestamp: number;
  timeLeft: number;
  isWorking: boolean;
  currentSet: number;
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
  const backgroundSnapshotRef = useRef<BackgroundSnapshot | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'inactive' || state === 'background') {
        // Arka plana alındığında snapshot al
        if (isRunning && !isPaused && !isEnd) {
          backgroundSnapshotRef.current = {
            timestamp: Date.now(),
            timeLeft: timeLeftRef.current,
            isWorking: isWorkingRef.current,
            currentSet: currentSetRef.current,
          };
        } else {
          backgroundSnapshotRef.current = null;
        }
        return;
      }
      if (state === 'active') {
        // Snapshot yoksa veya timer çalışmıyorsa bir şey yapma
        if (!backgroundSnapshotRef.current) return;

        const snapshot = backgroundSnapshotRef.current;
        backgroundSnapshotRef.current = null;

        // Interval varsa durdur, hesap sonrası tekrar başlatacağız
        clearInterval();

        const now = Date.now();
        let delta = Math.floor((now - snapshot.timestamp) / 1000);
        
        // Snapshot'tan başlayarak hesaplama yap
        let currentTimeLeft = snapshot.timeLeft;
        let currentIsWorking = snapshot.isWorking;
        let currentSet = snapshot.currentSet;

        // Geçen süreyi uygula: fazlar arası geçişleri de hesaba kat
        while (delta > 0 && !isEnd) {
          const totalCurrent = currentIsWorking ? (setDuration || 0) : restDuration;
          
          // Süresiz çalışma ise sadece dinlenmede telafi uygularız
          if (currentIsWorking && setDuration === 0) {
            break;
          }
          
          const need = currentTimeLeft;
          
          if (delta < need) {
            // Bu faz içinde kalıyoruz
            currentTimeLeft = need - delta;
            delta = 0;
          } else {
            // Bu faz bitiyor
            delta -= need;
            currentTimeLeft = 0;
            
            // Faz sonu mantığını manuel ilerlet
            if (currentIsWorking) {
              // Work fazı bitiyor
              if (currentSet < setCount) {
                // Dinlenme fazına geç
                currentIsWorking = false;
                currentTimeLeft = restDuration;
              } else {
                // Son set bitti, antrenman tamamlandı
                setIsRunning(false);
                setIsEnd(true);
                break;
              }
            } else {
              // Rest fazı bitiyor, bir sonraki sete geç
              currentSet += 1;
              currentIsWorking = true;
              currentTimeLeft = setDuration;
              
              if (setDuration === 0) {
                // Süresiz çalışma fazına gelindiyse daha fazla otomatik akış yok
                break;
              }
            }
          }
        }

        // State'i güncelle
        timeLeftRef.current = currentTimeLeft;
        setTimeLeft(currentTimeLeft);
        isWorkingRef.current = currentIsWorking;
        setIsWorking(currentIsWorking);
        currentSetRef.current = currentSet;
        setCurrentSet(currentSet);

        // Bitti değilse interval'i yeniden başlat
        if (!isEnd && isRunning && !(currentIsWorking && setDuration === 0)) {
          startInterval();
        }
      }
    });

    return () => {
      sub.remove();
    };
  }, [isPaused, isEnd, restDuration, setDuration, setCount, isRunning, timeLeftRef, isWorkingRef, currentSetRef, setTimeLeft, setIsWorking, setCurrentSet, setIsRunning, setIsEnd, startInterval, clearInterval]);
};

