import { Dimensions } from 'react-native';

export const LIMITS = {
  SET_COUNT_MIN: 1,
  SET_COUNT_MAX: 50,
  DURATION_MIN: 0,
  DURATION_MAX: 300,
} as const;

export const CIRCLE_CONFIG = {
  WIDTH_RATIO: 0.6,
  HEIGHT_RATIO: 0.3,
  STROKE_OFFSET: 20,
  STROKE_WIDTH: 12,
} as const;

export const getCircleSize = () => {
  const { width, height } = Dimensions.get('window');
  return Math.min(width * CIRCLE_CONFIG.WIDTH_RATIO, height * CIRCLE_CONFIG.HEIGHT_RATIO);
};

export const CIRCLE_SIZE = getCircleSize();

// Progress renk eşikleri
export const PROGRESS_THRESHOLDS = {
  GREEN_MAX: 33,
  ORANGE_MAX: 66,
  RED_MAX: 100,
} as const;

// Progress renkleri
export const PROGRESS_COLORS = {
  GREEN: '#10B981',
  ORANGE: '#F59E0B',
  RED: '#EF4444',
} as const;

// Animasyon süreleri (ms)
export const ANIMATION_DURATION = {
  SHORT: 150,
  MEDIUM: 200,
  LONG: 300,
} as const;

// Animasyon ayarları
export const ANIMATION_CONFIG = {
  SPRING_TENSION: 50,
  SPRING_FRICTION: 7,
} as const;

// Tipografi boyutları
export const TYPOGRAPHY = {
  TITLE: 32,
  HEADING: 24,
  BODY: 16,
  CAPTION: 12,
  LARGE: 48,
} as const;

// Spacing değerleri
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
} as const;

// Border radius değerleri
export const BORDER_RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
} as const;

// Shadow ayarları
export const SHADOW = {
  OFFSET: {
    width: 0,
    height: 4,
  },
  OPACITY: 0.1,
  RADIUS: 12,
  ELEVATION: 8,
} as const;

// Timer Button renkleri
export const BUTTON_COLORS = {
  START: '#059669',
  PAUSE: '#D97706',
  RESUME: '#059669',
  NEXT: '#7C3AED',
  RESET: '#DC2626',
  FINISH_SET: '#10B981',
  FINISH_REST: '#3B82F6',
} as const;

// Timer ayarları
export const TIMER = {
  INTERVAL_MS: 1000, // 1 saniye = 1000ms
} as const;

