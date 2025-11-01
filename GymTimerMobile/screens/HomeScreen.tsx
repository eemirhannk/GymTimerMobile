import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import * as Speech from 'expo-speech';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { sanitizeSetCount, sanitizeDuration, validateSetCount, validateDuration } from '../utils/validators';
import { SoundMode } from '../types';
import { showErrorToast } from '../utils/toast';
import { useTheme } from '../theme/ThemeContext';

const SOUND_EFFECT_FILE = require('../assets/sounds/rest.mp3');

type HomeScreenProps = {
  setCount: string;
  setDuration: string;
  restDuration: string;
  soundMode: SoundMode;
  onSetCountChange: (text: string) => void;
  onSetDurationChange: (text: string) => void;
  onRestDurationChange: (text: string) => void;
  onSoundModeChange: (mode: SoundMode) => void;
  onStart: () => void;
};

export default function HomeScreen({
  setCount,
  setDuration,
  restDuration,
  soundMode,
  onSetCountChange,
  onSetDurationChange,
  onRestDurationChange,
  onSoundModeChange,
  onStart,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const player = useAudioPlayer(SOUND_EFFECT_FILE as AudioSource);

  useEffect(() => {
    player.loop = false;
    player.volume = 1.0;
  }, [player]);

  const playFeedbackSound = useCallback(async (newMode: SoundMode) => {
    try {
      if (newMode === 'effects') {
        // Ses efekti moduna geçildi, rest.mp3 çal
        player.seekTo(0);
        player.play();
      } else {
        // Sesli anons moduna geçildi, speak ile ses çal
        const message = t('speechModeSelected');
        Speech.speak(message, {
          language: i18n.language === 'tr' ? 'tr-TR' : 'en-US',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
        });
      }
    } catch (error) {
      showErrorToast('errorPlaySound');
    }
  }, [t, player]);

  const handleSetCountChange = (text: string) => {
    // Önce validation yap
    const validation = validateSetCount(text);
    if (!validation.valid && validation.error && text !== '') {
      // Toast göster
      let errorKey = 'validationInvalidNumber';
      switch (validation.error) {
        case 'invalid_number':
          errorKey = 'validationInvalidNumber';
          break;
        case 'min_1':
          errorKey = 'validationSetCountMin';
          break;
        case 'max_50':
          errorKey = 'validationSetCountMax';
          break;
      }
      showErrorToast(errorKey);
    }
    
    // Sanitize et ve güncelle
    const sanitized = sanitizeSetCount(text);
    onSetCountChange(sanitized);
  };

  const handleSetDurationChange = (text: string) => {
    // Önce validation yap
    const validation = validateDuration(text);
    if (!validation.valid && validation.error && text !== '') {
      // Toast göster
      let errorKey = 'validationInvalidNumber';
      switch (validation.error) {
        case 'invalid_number':
          errorKey = 'validationInvalidNumber';
          break;
        case 'min_0':
          errorKey = 'validationDurationMin';
          break;
        case 'max_300':
          errorKey = 'validationDurationMax';
          break;
      }
      showErrorToast(errorKey);
    }
    
    // Sanitize et ve güncelle
    const sanitized = sanitizeDuration(text);
    onSetDurationChange(sanitized);
  };

  const handleRestDurationChange = (text: string) => {
    // Önce validation yap
    const validation = validateDuration(text);
    if (!validation.valid && validation.error && text !== '') {
      // Toast göster
      let errorKey = 'validationInvalidNumber';
      switch (validation.error) {
        case 'invalid_number':
          errorKey = 'validationInvalidNumber';
          break;
        case 'min_0':
          errorKey = 'validationDurationMin';
          break;
        case 'max_300':
          errorKey = 'validationDurationMax';
          break;
      }
      showErrorToast(errorKey);
    }
    
    // Sanitize et ve güncelle
    const sanitized = sanitizeDuration(text);
    onRestDurationChange(sanitized);
  };

  const handleSoundModeChange = useCallback((value: boolean) => {
    const newMode: SoundMode = value ? 'speech' : 'effects';
    onSoundModeChange(newMode);
    playFeedbackSound(newMode);
  }, [onSoundModeChange, playFeedbackSound]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.keyboardView}>
        <ScrollView 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.title, { color: colors.text }]}>{t('title')}</Text>
          
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
              <Text style={[styles.label, { color: colors.text }]}>{t('setCount')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                value={setCount}
                onChangeText={handleSetCountChange}
                keyboardType="numeric"
                placeholder={t('ph_example3')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('setDuration')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                value={setDuration}
                onChangeText={handleSetDurationChange}
                keyboardType="numeric"
                placeholder={t('ph_noLimit')}
                placeholderTextColor={colors.textTertiary}
              />
              <Text style={[styles.hint, { color: colors.textSecondary }]}>{t('setHint')}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('restDuration')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
                value={restDuration}
                onChangeText={handleRestDurationChange}
                keyboardType="numeric"
                placeholder={t('ph_example60')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.soundModeContainer}>
              <View style={styles.soundModeIconContainer}>
                <Text style={styles.soundModeIcon}>🔊</Text>
              </View>
              <Switch
                value={soundMode === 'speech'}
                onValueChange={handleSoundModeChange}
                trackColor={{ true: colors.switch.trackTrue }}
                thumbColor={colors.switch.thumb}
                ios_backgroundColor={colors.switch.iosBackground}
              />
              <View style={styles.soundModeIconContainer}>
                <Text style={styles.soundModeIcon}>🎙️</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.startButton, { backgroundColor: colors.primary }]} 
              onPress={onStart}
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
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
  },
  languageButtonText: {
    fontSize: 14,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
  soundModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  soundModeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundModeIcon: {
    fontSize: 24,
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
});

