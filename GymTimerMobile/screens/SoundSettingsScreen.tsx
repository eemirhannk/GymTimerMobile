import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useAdvancedSoundSettings } from '../hooks/useAdvancedSoundSettings';
import { usePremium } from '../hooks/usePremium';
import { showSuccessToast } from '../utils/toast';

type SoundSettingsScreenProps = {
  onBack: () => void;
};

export default function SoundSettingsScreen({ onBack }: SoundSettingsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const { settings, updateSettings, resetSettings } = useAdvancedSoundSettings();

  const [localSettings, setLocalSettings] = useState(settings);

  // Settings değiştiğinde localSettings'ı güncelle
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Premium kontrolü
  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('soundSettingsTitle')}
          </Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.premiumRequired}>
          <Text style={[styles.premiumRequiredText, { color: colors.text }]}>
            {t('premiumRequired')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    await updateSettings(localSettings);
    showSuccessToast('successSettingsSaved');
  };

  const handleReset = () => {
    Alert.alert(
      t('soundReset'),
      t('soundResetConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('reset'),
          style: 'destructive',
          onPress: async () => {
            const defaultSettings = {
              workSoundEnabled: true,
              restSoundEnabled: true,
              congratsSoundEnabled: true,
            };
            await resetSettings();
            setLocalSettings(defaultSettings);
            showSuccessToast('successSettingsSaved');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('soundSettingsTitle')}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Effect Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('effectSettings')}
            </Text>
            <TouchableOpacity onPress={handleReset} style={styles.resetButtonInSection}>
              <Text style={[styles.resetButtonTextInSection, { color: colors.primary }]}>
                {t('soundReset')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sound Effects Enable/Disable */}
          <View style={styles.inputContainer}>
            <View style={styles.inputLabel}>
              <Text style={[styles.inputLabelText, { color: colors.text }]}>
                {t('soundEffects')}
              </Text>
            </View>

            {/* Work Sound */}
            <View style={[styles.switchContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.switchLabel}>
                <Text style={[styles.switchLabelText, { color: colors.text }]}>
                  {t('workSoundEnabled')}
                </Text>
              </View>
              <Switch
                value={localSettings.workSoundEnabled ?? true}
                onValueChange={(value) => {
                  setLocalSettings({ ...localSettings, workSoundEnabled: value });
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>

            {/* Rest Sound */}
            <View style={[styles.switchContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.switchLabel}>
                <Text style={[styles.switchLabelText, { color: colors.text }]}>
                  {t('restSoundEnabled')}
                </Text>
              </View>
              <Switch
                value={localSettings.restSoundEnabled ?? true}
                onValueChange={(value) => {
                  setLocalSettings({ ...localSettings, restSoundEnabled: value });
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>

            {/* Congrats Sound */}
            <View style={[styles.switchContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <View style={styles.switchLabel}>
                <Text style={[styles.switchLabelText, { color: colors.text }]}>
                  {t('congratsSoundEnabled')}
                </Text>
              </View>
              <Switch
                value={localSettings.congratsSoundEnabled ?? true}
                onValueChange={(value) => {
                  setLocalSettings({ ...localSettings, congratsSoundEnabled: value });
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonInSection: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetButtonTextInSection: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputHint: {
    fontSize: 12,
  },
  voiceContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  voiceButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  switchLabel: {
    flex: 1,
  },
  switchLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  premiumRequiredText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

