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

// Varsayılan değerler
export const DEFAULT_VALUES = {
  SET_COUNT: 3,
  SET_DURATION: 0,
  REST_DURATION: 60,
} as const;

// Error key mapping
export const ERROR_KEY_MAP = {
  invalid_number: 'validationInvalidNumber',
  min_1: 'validationSetCountMin',
  max_50: 'validationSetCountMax',
  max_5_free: 'validationSetCountMaxFree',
  min_0: 'validationDurationMin',
  max_300: 'validationDurationMax',
  max_300_free: 'validationDurationMaxFree',
} as const;

// Premium özellikler
export const PREMIUM = {
  FREE_MAX_SETS: 5, // Ücretsiz kullanıcılar için maksimum set sayısı
  FREE_MAX_DURATION: 300, // Ücretsiz kullanıcılar için maksimum süre (saniye)
  STORAGE_KEY: '@gymtimer:premium',
  THEME_STORAGE_KEY: '@gymtimer:premiumTheme', // Premium tema seçimi
  THEME_MODE_STORAGE_KEY: '@gymtimer:themeMode', // Tema modu (light/dark) seçimi
  WORKOUTS_STORAGE_KEY: '@gymtimer:workouts', // Antrenman geçmişi
  TEMPLATES_STORAGE_KEY: '@gymtimer:templates', // Antrenman şablonları
  PROGRAMS_STORAGE_KEY: '@gymtimer:programs', // Antrenman programları
  SOUND_SETTINGS_STORAGE_KEY: '@gymtimer:soundSettings', // Gelişmiş ses ayarları
  PRODUCT_IDS: {
    LIFETIME: 'premium_lifetime', // Tek seferlik satın alma
    MONTHLY: 'premium_monthly', // Aylık abonelik
  },
  ONBOARDING_COMPLETED_KEY: '@gymtimer:premiumOnboardingCompleted', // Premium onboarding tamamlandı mı?
} as const;

// Swipe gesture ayarları
export const SWIPE = {
  THRESHOLD: 50, // Minimum swipe mesafesi (piksel)
  LEFT_EDGE_RATIO: 0.15, // Sol kenar eşiği (ekran genişliğinin yüzdesi)
  RIGHT_EDGE_RATIO: 0.85, // Sağ kenar eşiği (ekran genişliğinin yüzdesi)
  MIN_GESTURE_DX: 10, // Minimum yatay hareket mesafesi (piksel)
} as const;

// Drawer ayarları
export const DRAWER = {
  WIDTH_RATIO: 0.7, // Drawer genişliği (ekran genişliğinin yüzdesi)
} as const;

// Antrenman kayıt ayarları
export const WORKOUT = {
  MIN_SETS_FOR_SAVE: 5, // Antrenman kaydı için minimum set sayısı
  ESTIMATED_DURATION: 60, // Süresiz süreler için tahmini süre (saniye)
} as const;

// Onboarding ayarları
export const ONBOARDING = {
  IMAGE_SIZE_RATIO: 0.6, // Onboarding görsel boyutu (ekran genişliğinin yüzdesi)
  BOTTOM_BUTTON_OFFSET: 80, // Alt butonun alt kenardan uzaklığı (piksel)
} as const;

// Storage keys
export const STORAGE_KEYS = {
  SET_COUNT: '@gymtimer:setCount',
  SET_DURATION: '@gymtimer:setDuration',
  REST_DURATION: '@gymtimer:restDuration',
  ONBOARDING_COMPLETED: '@gymtimer:onboarding_completed',
} as const;

