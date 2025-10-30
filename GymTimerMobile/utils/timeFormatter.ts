export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateProgress = (
  timeLeft: number,
  total: number,
  isWorking: boolean,
  setDuration: number
): number => {
  if (setDuration === 0 && isWorking) return 0;
  if (total === 0) return 0;
  return ((total - timeLeft) / total) * 100;
};

