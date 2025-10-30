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

