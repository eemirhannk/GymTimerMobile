import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { sanitizeSetCount, sanitizeDuration, validateSetCount, validateDuration } from '../utils/validators';
import { useTheme } from '../theme/ThemeContext';
import { useInputValidation } from '../hooks/useInputValidation';
import { DEFAULT_VALUES, PREMIUM, SWIPE } from '../utils/constants';
import { usePremium } from '../hooks/usePremium';
import { showErrorToast, showPremiumToast } from '../utils/toast';
import gymTimerIcon from '../assets/gymTimerIcon.jpeg';


type HomeScreenProps = {
  setCount: string;
  setDuration: string;
  restDuration: string;
  onSetCountChange: (text: string) => void;
  onSetDurationChange: (text: string) => void;
  onRestDurationChange: (text: string) => void;
  onStart: () => void;
  onOpenPurchase: () => void;
  onOpenDrawer: () => void;
  onOpenHelp?: () => void;
};

export default function HomeScreen({
      setCount,
      setDuration,
      restDuration,
      onSetCountChange,
      onSetDurationChange,
      onRestDurationChange,
      onStart,
      onOpenPurchase,
      onOpenDrawer,
      onOpenHelp,
    }: HomeScreenProps) {
  const { t } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const { isPremium } = usePremium();
  
  // Kullanıcının girdiği ham değerleri tut (sanitize edilmeden önce)
  const [rawSetCount, setRawSetCount] = useState(setCount);
  const [rawSetDuration, setRawSetDuration] = useState(setDuration);
  const [rawRestDuration, setRawRestDuration] = useState(restDuration);
  
  // Swipe gesture için
  const swipeStartX = useRef<number | null>(null);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Sadece yatay hareketlerde aktif ol
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > SWIPE.MIN_GESTURE_DX;
      },
      onPanResponderGrant: (evt) => {
        swipeStartX.current = evt.nativeEvent.pageX;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (swipeStartX.current === null) return;
        
        const swipeDistance = gestureState.dx;
        const startX = swipeStartX.current;
        const screenWidth = Dimensions.get('window').width;
        
        // Soldan sağa swipe (drawer aç) - sol kenardan başlayıp sağa doğru
        if (swipeDistance > SWIPE.THRESHOLD && startX < screenWidth * SWIPE.LEFT_EDGE_RATIO && isPremium) {
          onOpenDrawer();
        }
        // Sağdan sola swipe (yardım merkezi aç) - sağ kenardan başlayıp sola doğru
        else if (swipeDistance < -SWIPE.THRESHOLD && startX > screenWidth * SWIPE.RIGHT_EDGE_RATIO && onOpenHelp) {
          onOpenHelp();
        }
        
        swipeStartX.current = null;
      },
    })
  ).current;

  // Input validation hooks
  const setCountValidation = useInputValidation({
    validator: (text: string) => validateSetCount(text, isPremium),
    sanitizer: (text: string) => sanitizeSetCount(text, isPremium),
  });

  const setDurationValidation = useInputValidation({
    validator: (text: string) => validateDuration(text, isPremium),
    sanitizer: (text: string) => sanitizeDuration(text, isPremium),
  });

  const restDurationValidation = useInputValidation({
    validator: (text: string) => validateDuration(text, isPremium),
    sanitizer: (text: string) => sanitizeDuration(text, isPremium),
  });


  const handleSetCountChange = useCallback(
    (text: string) => {
      // Ham değeri kaydet (PremiumGate kontrolü için)
      setRawSetCount(text);
      // Premium limit kontrolü - sadece free kullanıcılar için
      const numValue = parseInt(text, 10);
      if (!isPremium && text && !isNaN(numValue) && numValue > PREMIUM.FREE_MAX_SETS) {
        // Toast göster
        showPremiumToast('premiumSetLimitReached', onOpenPurchase, 5000);
      }
      // Sanitize edip state'e kaydet
      setCountValidation.handleChange(text, onSetCountChange);
    },
    [setCountValidation, onSetCountChange, isPremium, onOpenPurchase]
  );
  
  // setCount prop olarak ilk kez geldiğinde rawSetCount'u güncelle
  // Kullanıcı yazdığında rawSetCount handleSetCountChange'de güncellenir
  const prevSetCountRef = useRef(setCount);
  useEffect(() => {
    // Sadece setCount prop olarak dışarıdan değiştiğinde (kullanıcı yazmadığında) güncelle
    if (prevSetCountRef.current !== setCount && rawSetCount === prevSetCountRef.current) {
      setRawSetCount(setCount);
    }
    prevSetCountRef.current = setCount;
  }, [setCount, rawSetCount]);

  // setDuration ve restDuration için de aynı mantık
  const prevSetDurationRef = useRef(setDuration);
  useEffect(() => {
    if (prevSetDurationRef.current !== setDuration && rawSetDuration === prevSetDurationRef.current) {
      setRawSetDuration(setDuration);
    }
    prevSetDurationRef.current = setDuration;
  }, [setDuration, rawSetDuration]);

  const prevRestDurationRef = useRef(restDuration);
  useEffect(() => {
    if (prevRestDurationRef.current !== restDuration && rawRestDuration === prevRestDurationRef.current) {
      setRawRestDuration(restDuration);
    }
    prevRestDurationRef.current = restDuration;
  }, [restDuration, rawRestDuration]);


  const handleSetDurationChange = useCallback(
    (text: string) => {
      // Ham değeri kaydet (PremiumGate kontrolü için)
      setRawSetDuration(text);
      // Premium limit kontrolü
      const numValue = parseInt(text, 10);
      if (!isPremium && text && !isNaN(numValue) && numValue > PREMIUM.FREE_MAX_DURATION) {
        // Toast göster
        showPremiumToast('premiumDurationLimitReached', onOpenPurchase, 5000);
      }
      // Sanitize edip state'e kaydet
      setDurationValidation.handleChange(text, onSetDurationChange);
    },
    [setDurationValidation, onSetDurationChange, isPremium, onOpenPurchase]
  );

  const handleRestDurationChange = useCallback(
    (text: string) => {
      // Ham değeri kaydet (PremiumGate kontrolü için)
      setRawRestDuration(text);
      // Premium limit kontrolü
      const numValue = parseInt(text, 10);
      if (!isPremium && text && !isNaN(numValue) && numValue > PREMIUM.FREE_MAX_DURATION) {
        // Toast göster
        showPremiumToast('premiumDurationLimitReached', onOpenPurchase, 5000);
      }
      // Sanitize edip state'e kaydet
      restDurationValidation.handleChange(text, onRestDurationChange);
    },
    [restDurationValidation, onRestDurationChange, isPremium, onOpenPurchase]
  );

  const handleStart = useCallback(() => {
    // Premium kontrolü: Set sayısı limitini kontrol et
    const setCountNum = parseInt(setCount, 10) || DEFAULT_VALUES.SET_COUNT;
    if (!isPremium && setCountNum > PREMIUM.FREE_MAX_SETS) {
      showErrorToast('premiumSetLimitReached');
      onOpenPurchase();
      return;
    }
    onStart();
  }, [setCount, isPremium, onStart, onOpenPurchase]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} {...panResponder.panHandlers}>
      <KeyboardAvoidingView style={styles.keyboardView}>
          {/* Header Buttons - Absolute Position */}
          <View style={styles.headerButtonsContainer}>
            {/* Hamburger Menu Button */}
            {isPremium && (
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={t('premiumThemes')}
                accessibilityHint={t('premiumThemes')}
                accessibilityRole="button"
                onPress={onOpenDrawer}
                style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <View style={styles.hamburgerIcon}>
                  <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
                  <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
                  <View style={[styles.hamburgerLine, { backgroundColor: colors.text }]} />
                </View>
              </TouchableOpacity>
            )}
            {/* Help Center Button */}
            {onOpenHelp && (
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={t('help.title')}
                accessibilityHint={t('help.subtitle')}
                accessibilityRole="button"
                onPress={onOpenHelp}
                style={[styles.headerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.helpIcon, { color: colors.text }]}>💬</Text>
              </TouchableOpacity>
            )}
          </View>

        <ScrollView 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerContainer}>
            <Image 
              source={gymTimerIcon} 
              style={styles.logo}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={t('title')}
              accessibilityRole="image"
            />
            <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
          </View>
          {/* Premium Upgrade Button */}
          {!isPremium && (
            <View style={styles.premiumButtonWrapper}>
              <TouchableOpacity
                accessible={true}
                accessibilityLabel={t('premiumUpgrade')}
                accessibilityHint={t('premiumUpgradeHint')}
                accessibilityRole="button"
                style={[styles.premiumButtonContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={onOpenPurchase}
                activeOpacity={0.7}
              >
                <Text style={[styles.premiumButtonText, { color: colors.text }]}>
                  {t('premiumUpgrade')}
                </Text>
                <Text style={[styles.premiumButtonArrow, { color: colors.primary }]}>→</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
            <View style={styles.languageButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  // Light ↔ Dark geçişi
                  setMode(mode === 'light' ? 'dark' : 'light');
                }}
                style={[styles.themeButton, { backgroundColor: colors.border }]}
              >
                <Text style={[styles.themeButtonText, { color: colors.text }]}>
                  {mode === 'light' ? '☀️' : '🌙'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                style={[styles.languageButton, { backgroundColor: colors.border }]}
              >
                <Text style={[styles.languageButtonText, { color: colors.text }]}>{i18n.language === 'tr' ? 'TR' : 'EN'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: colors.text }]}>{t('setCount')}</Text>
                {!isPremium && (
                  <Text style={[styles.premiumLabel, { color: colors.textSecondary }]}>
                    {t('premiumSetLimit', { max: PREMIUM.FREE_MAX_SETS })}
                  </Text>
                )}
              </View>
              <TextInput
                accessible={true}
                accessibilityLabel={t('setCount')}
                accessibilityHint={t('setCount') + ' ' + t('ph_example3')}
                accessibilityRole="none"
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
                  !isPremium && parseInt(rawSetCount, 10) > PREMIUM.FREE_MAX_SETS && styles.inputLimited,
                ]}
                value={setCount}
                onChangeText={handleSetCountChange}
                keyboardType="numeric"
                placeholder={t('ph_example3')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: colors.text }]}>{t('setDuration')}</Text>
                {!isPremium && (
                  <Text style={[styles.premiumLabel, { color: colors.textSecondary }]}>
                    {t('premiumDurationLimit', { max: PREMIUM.FREE_MAX_DURATION })}
                  </Text>
                )}
              </View>
              <TextInput
                accessible={true}
                accessibilityLabel={t('setDuration')}
                accessibilityHint={t('setDuration')}
                accessibilityRole="none"
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
                  !isPremium && rawSetDuration && !isNaN(parseInt(rawSetDuration, 10)) && parseInt(rawSetDuration, 10) > PREMIUM.FREE_MAX_DURATION && styles.inputLimited,
                ]}
                value={setDuration === '0' ? '' : setDuration}
                onChangeText={handleSetDurationChange}
                keyboardType="numeric"
                placeholder={t('ph_example60')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: colors.text }]}>{t('restDuration')}</Text>
                {!isPremium && (
                  <Text style={[styles.premiumLabel, { color: colors.textSecondary }]}>
                    {t('premiumDurationLimit', { max: PREMIUM.FREE_MAX_DURATION })}
                  </Text>
                )}
              </View>
              <TextInput
                accessible={true}
                accessibilityLabel={t('restDuration')}
                accessibilityHint={t('restDuration') + ' ' + t('ph_example60')}
                accessibilityRole="none"
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface },
                  !isPremium && rawRestDuration && !isNaN(parseInt(rawRestDuration, 10)) && parseInt(rawRestDuration, 10) > PREMIUM.FREE_MAX_DURATION && styles.inputLimited,
                ]}
                value={restDuration === '0' ? '' : restDuration}
                onChangeText={handleRestDurationChange}
                keyboardType="numeric"
                placeholder={t('ph_example60')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <TouchableOpacity 
              accessible={true}
              accessibilityLabel={t('start')}
              accessibilityHint={t('start') + ' - ' + t('setCount') + ': ' + setCount + ', ' + t('restDuration') + ': ' + restDuration}
              accessibilityRole="button"
              style={[styles.startButton, { backgroundColor: colors.primary }]} 
              onPress={handleStart}
            >
              <Text style={styles.startButtonText}>{t('start')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    width: '100%',
    borderRadius: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  headerButtonsContainer: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 24,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  languageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  themeButton: {
    padding: 8,
    borderRadius: 8,
  },
  themeButtonText: {
    fontSize: 18,
  },
  languageButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  languageButtonText: {
    fontSize: 14,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  premiumLabel: {
    fontSize: 12,
  },
  inputLimited: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 14,
  },
  startButton: {
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  premiumButtonWrapper: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  premiumButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    gap: 6,
  },
  premiumButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  premiumButtonArrow: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

