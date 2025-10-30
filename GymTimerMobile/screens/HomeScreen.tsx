import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { sanitizeSetCount, sanitizeDuration } from '../utils/validators';

type HomeScreenProps = {
  setCount: string;
  setDuration: string;
  restDuration: string;
  onSetCountChange: (text: string) => void;
  onSetDurationChange: (text: string) => void;
  onRestDurationChange: (text: string) => void;
  onStart: () => void;
};

export default function HomeScreen({
  setCount,
  setDuration,
  restDuration,
  onSetCountChange,
  onSetDurationChange,
  onRestDurationChange,
  onStart,
}: HomeScreenProps) {
  const { t } = useTranslation();

  const handleSetCountChange = (text: string) => {
    const sanitized = sanitizeSetCount(text);
    onSetCountChange(sanitized);
  };

  const handleSetDurationChange = (text: string) => {
    const sanitized = sanitizeDuration(text);
    onSetDurationChange(sanitized);
  };

  const handleRestDurationChange = (text: string) => {
    const sanitized = sanitizeDuration(text);
    onRestDurationChange(sanitized);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardView}>
        <ScrollView 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>{t('title')}</Text>
          
          <View style={styles.card}>
            <View style={styles.languageButtonContainer}>
              <TouchableOpacity
                onPress={() => i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr')}
                style={styles.languageButton}
              >
                <Text style={styles.languageButtonText}>{i18n.language === 'tr' ? 'TR' : 'EN'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('setCount')}</Text>
              <TextInput
                style={styles.input}
                value={setCount}
                onChangeText={handleSetCountChange}
                keyboardType="numeric"
                placeholder={t('ph_example3')}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('setDuration')}</Text>
              <TextInput
                style={styles.input}
                value={setDuration}
                onChangeText={handleSetDurationChange}
                keyboardType="numeric"
                placeholder={t('ph_noLimit')}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.hint}>{t('setHint')}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('restDuration')}</Text>
              <TextInput
                style={styles.input}
                value={restDuration}
                onChangeText={handleRestDurationChange}
                keyboardType="numeric"
                placeholder={t('ph_example60')}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity style={styles.startButton} onPress={onStart}>
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
    backgroundColor: '#F3F4F6',
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
    color: '#1F2937',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  languageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
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
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
  },
  startButton: {
    backgroundColor: '#059669',
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

