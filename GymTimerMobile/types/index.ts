export * from './workout';
export * from './template';
export * from './program';
export * from './sound';

export type TemplateSequenceItem = {
  setCount: number;
  setDuration: number;
  restDuration: number;
};

export type TimerScreenProps = {
  setCount: number;
  setDuration: number;
  restDuration: number;
  templateSequence?: TemplateSequenceItem[]; // Şablon dizisi (program için)
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

