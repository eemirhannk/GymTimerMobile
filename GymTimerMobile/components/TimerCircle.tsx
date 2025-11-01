import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CIRCLE_SIZE, PROGRESS_THRESHOLDS, PROGRESS_COLORS, ANIMATION_DURATION, ANIMATION_CONFIG, CIRCLE_CONFIG } from '../utils/constants';
import { formatTime } from '../utils/timeFormatter';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type TimerCircleProps = {
  timeLeft: number;
  progress: number;
  isWorking: boolean;
  isRunning: boolean;
  setDuration: number;
  restDuration: number;
};

function TimerCircle({
  timeLeft,
  progress,
  isWorking,
  isRunning,
  setDuration,
  restDuration,
}: TimerCircleProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
  const radius = useMemo(() => CIRCLE_SIZE / 2 - 20, []);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
  const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);
  
  // Animasyon değerleri
  const progressAnim = useRef(new Animated.Value(progress)).current;
  const strokeColorOpacity = useRef(new Animated.Value(1)).current;

  // Progress animasyonu (smooth geçiş)
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      tension: ANIMATION_CONFIG.SPRING_TENSION,
      friction: ANIMATION_CONFIG.SPRING_FRICTION,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Renk geçişi fade animasyonu (work/rest değişiminde)
  useEffect(() => {
    Animated.sequence([
      Animated.timing(strokeColorOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION.MEDIUM,
        useNativeDriver: false,
      }),
      Animated.timing(strokeColorOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.LONG,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isWorking]);

  // Animated değerler
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  // Progress'e göre renk hesaplama
  const strokeColor = useMemo(() => {
    if (progress <= PROGRESS_THRESHOLDS.GREEN_MAX) {
      return PROGRESS_COLORS.GREEN;
    } else if (progress <= PROGRESS_THRESHOLDS.ORANGE_MAX) {
      return PROGRESS_COLORS.ORANGE;
    } else {
      return PROGRESS_COLORS.RED;
    }
  }, [progress]);

  // Renk segment değişiminde fade animasyonu
  const prevColorRef = useRef(strokeColor);
  useEffect(() => {
    if (prevColorRef.current !== strokeColor) {
      Animated.sequence([
        Animated.timing(strokeColorOpacity, {
          toValue: 0.5,
          duration: ANIMATION_DURATION.SHORT,
          useNativeDriver: false,
        }),
        Animated.timing(strokeColorOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION.SHORT,
          useNativeDriver: false,
        }),
      ]).start();
      prevColorRef.current = strokeColor;
    }
  }, [strokeColor]);
  
  const timerTextStyle = useMemo(() => {
    // Timer durmuş, süre başlamış (progress > 0) ve bitmemiş (progress < 100) ise tema rengi
    if (!isRunning && progress > 0 && progress < 100) {
      return { color: colors.text };
    }
    // Circle ile aynı renk (progress'e göre)
    return { color: strokeColor };
  }, [isRunning, progress, strokeColor, colors.text]);

  const displayText = useMemo(() => {
    return setDuration === 0 && isWorking ? '--:--' : formattedTime;
  }, [setDuration, isWorking, formattedTime]);

  const showTimeless = useMemo(() => {
    return setDuration === 0 && isWorking && isRunning;
  }, [setDuration, isWorking, isRunning]);

  return (
    <View style={styles.circleContainer}>
      <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
        <Circle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={CIRCLE_CONFIG.STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={CIRCLE_CONFIG.STROKE_WIDTH}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          opacity={strokeColorOpacity}
        />
      </Svg>
      <View style={styles.timerTextContainer}>
        <Text style={[styles.timerText, timerTextStyle]}>
          {displayText}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(TimerCircle);

const styles = StyleSheet.create({
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  timerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  workingTimerText: {
    color: '#10B981',
  },
  restTimerText: {
    color: '#3B82F6',
  },
});
