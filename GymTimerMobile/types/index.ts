export type TimerScreenProps = {
  setCount: number;
  setDuration: number;
  restDuration: number;
  onBack: () => void;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export type TimerPhase = 'work' | 'rest';

export type TimerState = {
  currentSet: number;
  isWorking: boolean;
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isEnd: boolean;
  isMuted: boolean;
};

