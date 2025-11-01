export type SoundMode = 'effects' | 'speech';

export type TimerScreenProps = {
  setCount: number;
  setDuration: number;
  restDuration: number;
  soundMode: SoundMode;
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

