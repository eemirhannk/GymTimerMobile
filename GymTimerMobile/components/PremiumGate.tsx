import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';

type PremiumGateProps = {
  onPress: () => void;
  message?: string;
  isPremium?: boolean; // Prop olarak geçilebilir, daha performanslı
};

export default function PremiumGate({ onPress, message, isPremium = false }: PremiumGateProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  // Premium kullanıcıysa hiçbir şey gösterme
  if (isPremium) {
    return null;
  }

  // Fade in ve slide down animasyonu
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade out ve slide up animasyonu (5 saniye sonra)
    const fadeOutTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 4700); // 5 saniye - 300ms = 4700ms (animasyon bitmeden önce başlasın)

    return () => {
      clearTimeout(fadeOutTimer);
    };
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={t('premiumUpgrade')}
        accessibilityRole="button"
        accessibilityHint={t('premiumUpgradeHint')}
        style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={[styles.icon, { color: colors.primary }]}>💪</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {message || t('premiumFeature')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('premiumUpgrade')}
            </Text>
          </View>
          <Text style={[styles.arrow, { color: colors.primary }]}>→</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

