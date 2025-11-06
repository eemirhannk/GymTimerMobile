import React, { useState, useEffect } from 'react';
import { WORKOUT } from '../utils/constants';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { usePremium } from '../hooks/usePremium';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { WorkoutTemplate } from '../types/template';
import { formatTime } from '../utils/timeFormatter';
import { showSuccessToast } from '../utils/toast';

type TemplatesScreenProps = {
  onBack: () => void;
  onUseTemplate: (template: WorkoutTemplate) => void;
  isRequiredMode?: boolean; // Zorunlu mod (minimum 2 şablon)
  onComplete?: () => void; // Zorunlu mod tamamlandığında çağrılacak callback
  minRequiredCount?: number; // Minimum gerekli şablon sayısı
};

type TemplateFormMode = 'create' | 'edit';

export default function TemplatesScreen({ 
  onBack, 
  onUseTemplate, 
  isRequiredMode = false,
  onComplete,
  minRequiredCount = 2,
}: TemplatesScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const { templates, isLoading, saveTemplate, updateTemplate, deleteTemplate, loadTemplates } = useWorkoutTemplates();

  const [formMode, setFormMode] = useState<TemplateFormMode | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplate | null>(null);
  const [formName, setFormName] = useState('');
  const [formSetCount, setFormSetCount] = useState('');
  const [formSetDuration, setFormSetDuration] = useState('');
  const [formRestDuration, setFormRestDuration] = useState('');

  // Form'u temizle
  const resetForm = () => {
    setFormMode(null);
    setEditingTemplate(null);
    setFormName('');
    setFormSetCount('');
    setFormSetDuration('');
    setFormRestDuration('');
  };

  // Form'u düzenleme için aç
  const handleEdit = (template: WorkoutTemplate) => {
    setEditingTemplate(template);
    setFormMode('edit');
    setFormName(template.name);
    setFormSetCount(template.setCount.toString());
    setFormSetDuration(template.setDuration.toString());
    setFormRestDuration(template.restDuration.toString());
  };

  // Form'u oluşturma için aç
  const handleCreate = () => {
    resetForm();
    setFormMode('create');
  };

  // Şablon kaydet
  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert(t('errorTitle'), t('templateName') + ' ' + t('required'));
      return;
    }

    const setCountNum = parseInt(formSetCount, 10);

    if (isNaN(setCountNum) || setCountNum < 1) {
      Alert.alert(t('errorTitle'), t('validationSetCountMin'));
      return;
    }

    // Set duration ve rest duration değerlerini al (boş ise 0 = süresiz)
    const setDurationNum = formSetDuration.trim() === '' ? 0 : parseInt(formSetDuration, 10);
    const restDurationNum = formRestDuration.trim() === '' ? 0 : parseInt(formRestDuration, 10);

    // Geçerli sayı kontrolü
    if (isNaN(setDurationNum) || setDurationNum < 0) {
      Alert.alert(t('errorTitle'), t('validationDurationMin'));
      return;
    }
    if (isNaN(restDurationNum) || restDurationNum < 0) {
      Alert.alert(t('errorTitle'), t('validationDurationMin'));
      return;
    }

    try {
      if (formMode === 'edit' && editingTemplate) {
        await updateTemplate(editingTemplate.id, {
          name: formName.trim(),
          setCount: setCountNum,
          setDuration: setDurationNum,
          restDuration: restDurationNum,
        });
        showSuccessToast('successTemplateSaved');
      } else {
        await saveTemplate({
          name: formName.trim(),
          setCount: setCountNum,
          setDuration: setDurationNum,
          restDuration: restDurationNum,
        });
        showSuccessToast('successTemplateCreated');
      }
      resetForm();
      loadTemplates();
    } catch (error) {
              Alert.alert(t('errorTitle'), t('errorSavingTemplate'));
    }
  };

  // Şablon sil
  const handleDelete = (template: WorkoutTemplate) => {
    // Zorunlu modda ve minimum sayıya ulaşıldıysa silmeyi engelle
    if (isRequiredMode && templates.length <= minRequiredCount) {
      Alert.alert(
        t('premiumOnboardingCannotExit'),
        t('premiumOnboardingTemplateRequired'),
        [{ text: t('ok'), style: 'default' }]
      );
      return;
    }

    Alert.alert(
      t('templateDelete'),
      t('templateDeleteConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTemplate(template.id);
              showSuccessToast('successTemplateDeleted');
              loadTemplates();
            } catch (error) {
              Alert.alert(t('errorTitle'), t('errorDeletingTemplate'));
            }
          },
        },
      ]
    );
  };

  // Şablonu kullan
  const handleUse = (template: WorkoutTemplate) => {
    onUseTemplate(template);
    if (!isRequiredMode) {
      onBack();
    }
  };

  // Geri çıkış kontrolü (zorunlu modda)
  const handleBack = () => {
    if (isRequiredMode && templates.length < minRequiredCount) {
      Alert.alert(
        t('premiumOnboardingCannotExit'),
        t('premiumOnboardingTemplateRequired'),
        [{ text: t('ok'), style: 'default' }]
      );
      return;
    }
    onBack();
  };

  // Şablon kaydedildikten sonra kontrol et
  useEffect(() => {
    if (isRequiredMode && onComplete && templates.length >= minRequiredCount) {
      // Kısa bir gecikme ile callback'i çağır (state güncellemesi için)
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [templates.length, isRequiredMode, minRequiredCount, onComplete]);

  // Premium kontrolü
  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('templatesTitle')}
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

  // Form görünümü
  if (formMode) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={resetForm} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {formMode === 'edit' ? t('templateEdit') : t('templateCreate')}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('templateName')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={formName}
                onChangeText={setFormName}
                placeholder={t('templateNamePlaceholder')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('setCount')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={formSetCount}
                onChangeText={setFormSetCount}
                keyboardType="numeric"
                placeholder={t('ph_example3')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('setDuration')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={formSetDuration}
                onChangeText={setFormSetDuration}
                keyboardType="numeric"
                placeholder={t('ph_example60')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('restDuration')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={formRestDuration}
                onChangeText={setFormRestDuration}
                keyboardType="numeric"
                placeholder={t('ph_example60')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.border }]}
              onPress={resetForm}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: 'white' }]}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Liste görünümü
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('templatesTitle')}
        </Text>
        <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
          <Text style={[styles.addButtonText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Zorunlu mod bilgilendirmesi */}
      {isRequiredMode && (
        <View style={[styles.requiredModeBanner, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
          <Text style={[styles.requiredModeText, { color: colors.text }]}>
            {t('premiumOnboardingTemplateRequired')} ({templates.length}/{minRequiredCount})
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : templates.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📋</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('templatesEmpty')}</Text>
            <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
              {t('templatesEmptyMessage')}
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleCreate}
            >
              <Text style={styles.createButtonText}>{t('templateCreate')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          templates.map((template) => (
            <View
              key={template.id}
              style={[styles.templateCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.templateHeader}>
                <Text style={[styles.templateName, { color: colors.text }]}>{template.name}</Text>
                <View style={styles.templateActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleUse(template)}
                  >
                    <Text style={styles.actionButtonText}>{t('templateUse')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton, { backgroundColor: colors.border }]}
                    onPress={() => handleEdit(template)}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton, { backgroundColor: colors.border }]}
                    onPress={() => handleDelete(template)}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.templateDetails}>
                <Text style={[styles.templateDetail, { color: colors.textSecondary }]}>
                  {template.setCount} {t('sets')} • {t('setDurationLabel')}: {formatTime(template.setDuration)} / {t('restDurationLabel')}: {formatTime(template.restDuration)}
                </Text>
                {(() => {
                  // Toplam süre hesapla: set süresi * set sayısı + dinlenme süresi * (set sayısı - 1)
                  // Eğer set süresi veya dinlenme süresi 0 ise (süresiz), tahmini süre olarak hesaplama yap
                  const estimatedSetDuration = template.setDuration === 0 ? WORKOUT.ESTIMATED_DURATION : template.setDuration;
                  const estimatedRestDuration = template.restDuration === 0 ? WORKOUT.ESTIMATED_DURATION : template.restDuration;
                  const totalSeconds = (estimatedSetDuration * template.setCount) + (estimatedRestDuration * (template.setCount - 1));
                  
                  // Tahmini hesaplama yapılıp yapılmadığını kontrol et
                  const isEstimated = template.setDuration === 0 || template.restDuration === 0;
                  
                  const formatTotalDuration = (seconds: number): string => {
                    if (seconds === 0) return '--:--';
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    if (hours > 0) {
                      return `${hours} ${t('hours')} ${minutes} ${t('minutes')}`;
                    }
                    return `${minutes} ${t('minutes')}`;
                  };
                  return (
                    <Text style={[styles.templateTotalDuration, { color: colors.textSecondary }]}>
                      {t('totalDuration')}{isEstimated ? ' ≈' : ''}: {formatTotalDuration(totalSeconds)}
                    </Text>
                  );
                })()}
              </View>
            </View>
          ))
        )}
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
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
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    // Primary color
  },
  cancelButton: {
    // Border color
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 32,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  templateDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  templateDetail: {
    fontSize: 14,
  },
  templateTotalDuration: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  requiredModeBanner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  requiredModeText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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

