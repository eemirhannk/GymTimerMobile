import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CIRCLE_SIZE } from '../utils/constants';
import { formatTime } from '../utils/timeFormatter';
import { useTranslation } from 'react-i18next';

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
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Renk geçişi fade animasyonu (work/rest değişiminde)
  useEffect(() => {
    Animated.sequence([
      Animated.timing(strokeColorOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(strokeColorOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isWorking]);

  // Animated değerler
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  // Progress'e göre renk hesaplama (0-33: yeşil, 33-66: turuncu, 66-100: kırmızı)
  const strokeColor = useMemo(() => {
    if (progress <= 33) {
      // İlk 1/3: Yeşil
      return '#10B981';
    } else if (progress <= 66) {
      // Orta 1/3: Turuncu
      return '#F59E0B';
    } else {
      // Son 1/3: Kırmızı
      return '#EF4444';
    }
  }, [progress]);

  // Renk segment değişiminde fade animasyonu
  const prevColorRef = useRef(strokeColor);
  useEffect(() => {
    if (prevColorRef.current !== strokeColor) {
      Animated.sequence([
        Animated.timing(strokeColorOpacity, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(strokeColorOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
      prevColorRef.current = strokeColor;
    }
  }, [strokeColor]);
  
  const timerTextStyle = useMemo(() => {
    // Timer durmuş, süre başlamış (progress > 0) ve bitmemiş (progress < 100) ise siyah
    // İlk anda (progress = 0) ve son anda (progress = 100) renkli olacak
    if (!isRunning && progress > 0 && progress < 100) return styles.stoppedTimerText;
    // Circle ile aynı renk (progress'e göre)
    return { color: strokeColor };
  }, [isRunning, progress, strokeColor]);

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
          stroke="#E5E7EB"
          strokeWidth="12"
          fill="none"
        />
        <AnimatedCircle
          cx={CIRCLE_SIZE / 2}
          cy={CIRCLE_SIZE / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="12"
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
        {showTimeless && (
          <Text style={styles.timelessText}>{t('timeless')}</Text>
        )}
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
  stoppedTimerText: {
    color: '#1F2937',
  },
  workingTimerText: {
    color: '#10B981',
  },
  restTimerText: {
    color: '#3B82F6',
  },
  timelessText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
