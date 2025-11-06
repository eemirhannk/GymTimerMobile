import React, { useState, useEffect } from 'react';
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
import { useWorkoutPrograms } from '../hooks/useWorkoutPrograms';
import { useWorkoutTemplates } from '../hooks/useWorkoutTemplates';
import { WorkoutProgram } from '../types/program';
import { WorkoutTemplate } from '../types/template';
import { showSuccessToast } from '../utils/toast';

type ProgramsScreenProps = {
  onBack: () => void;
  onUseProgram: (templates: WorkoutTemplate[]) => void;
  isRequiredMode?: boolean; // Zorunlu mod (minimum 1 program)
  onComplete?: () => void; // Zorunlu mod tamamlandığında çağrılacak callback
  minRequiredCount?: number; // Minimum gerekli program sayısı
};

type ProgramFormMode = 'create' | 'edit';

export default function ProgramsScreen({ 
  onBack, 
  onUseProgram, 
  isRequiredMode = false,
  onComplete,
  minRequiredCount = 1,
}: ProgramsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const { programs, isLoading, saveProgram, updateProgram, deleteProgram, loadPrograms, getProgram } = useWorkoutPrograms();
  const { templates, getTemplate } = useWorkoutTemplates();

  const [formMode, setFormMode] = useState<ProgramFormMode | null>(null);
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);

  // Form'u temizle
  const resetForm = () => {
    setFormMode(null);
    setEditingProgram(null);
    setFormName('');
    setFormDescription('');
    setSelectedTemplateIds([]);
  };

  // Form'u düzenleme için aç
  const handleEdit = (program: WorkoutProgram) => {
    setEditingProgram(program);
    setFormMode('edit');
    setFormName(program.name);
    setFormDescription(program.description || '');
    setSelectedTemplateIds(program.templates || []);
  };

  // Form'u oluşturma için aç
  const handleCreate = () => {
    resetForm();
    setFormMode('create');
  };

  // Şablon seçimi toggle
  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Program kaydet
  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert(t('errorTitle'), t('programName') + ' ' + t('required'));
      return;
    }

    if (selectedTemplateIds.length === 0) {
      Alert.alert(t('errorTitle'), t('programSelectTemplates'));
      return;
    }

    try {
      if (formMode === 'edit' && editingProgram) {
        await updateProgram(editingProgram.id, {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
          templates: selectedTemplateIds,
        });
        showSuccessToast('successProgramSaved');
      } else {
        await saveProgram({
          name: formName.trim(),
          description: formDescription.trim() || undefined,
          templates: selectedTemplateIds,
        });
        showSuccessToast('successProgramCreated');
      }
      resetForm();
      loadPrograms();
    } catch (error) {
      Alert.alert(t('errorTitle'), t('errorSavingProgram'));
    }
  };

  // Program sil
  const handleDelete = (program: WorkoutProgram) => {
    // Zorunlu modda ve minimum sayıya ulaşıldıysa silmeyi engelle
    if (isRequiredMode && programs.length <= minRequiredCount) {
      Alert.alert(
        t('premiumOnboardingCannotExit'),
        t('premiumOnboardingProgramRequired'),
        [{ text: t('ok'), style: 'default' }]
      );
      return;
    }

    Alert.alert(
      t('programDelete'),
      t('programDeleteConfirm'),
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
              await deleteProgram(program.id);
              showSuccessToast('successProgramDeleted');
              loadPrograms();
            } catch (error) {
              Alert.alert(t('errorTitle'), t('errorDeletingProgram'));
            }
          },
        },
      ]
    );
  };

  // Programı kullan
  const handleUse = (program: WorkoutProgram) => {
    // Template ID'lerini WorkoutTemplate objelerine çevir
    const programTemplates = program.templates
      .map((id) => getTemplate(id))
      .filter((template): template is WorkoutTemplate => template !== undefined);
    
    if (programTemplates.length > 0) {
      onUseProgram(programTemplates);
      // onUseProgram zaten Timer ekranına geçiyor, onBack() gereksiz
    } else {
      Alert.alert(t('errorTitle'), t('templatesEmpty'));
    }
  };

  // Geri çıkış kontrolü (zorunlu modda)
  const handleBack = () => {
    if (isRequiredMode && programs.length < minRequiredCount) {
      Alert.alert(
        t('premiumOnboardingCannotExit'),
        t('premiumOnboardingProgramRequired'),
        [{ text: t('ok'), style: 'default' }]
      );
      return;
    }
    onBack();
  };

  // Program kaydedildikten sonra kontrol et
  useEffect(() => {
    if (isRequiredMode && onComplete && programs.length >= minRequiredCount) {
      // Kısa bir gecikme ile callback'i çağır (state güncellemesi için)
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [programs.length, isRequiredMode, minRequiredCount, onComplete]);

  // Premium kontrolü
  if (!isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('programsTitle')}
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
    const availableTemplates = templates.filter((t) => t.id);

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={resetForm} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {formMode === 'edit' ? t('programEdit') : t('programCreate')}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('programName')}</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={formName}
                onChangeText={setFormName}
                placeholder={t('programNamePlaceholder')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('programDescription')}</Text>
              <TextInput
                style={[styles.textArea, { borderColor: colors.border, color: colors.text, backgroundColor: colors.background }]}
                value={formDescription}
                onChangeText={setFormDescription}
                placeholder={t('programDescriptionPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>{t('programSelectTemplates')}</Text>
              {availableTemplates.length === 0 ? (
                <View style={[styles.emptyTemplates, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.emptyTemplatesText, { color: colors.textSecondary }]}>
                    {t('templatesEmpty')}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.templatesList} nestedScrollEnabled>
                  {availableTemplates.map((template) => {
                    const isSelected = selectedTemplateIds.includes(template.id);
                    const selectionOrder = isSelected ? selectedTemplateIds.indexOf(template.id) + 1 : null;
                    return (
                      <TouchableOpacity
                        key={template.id}
                        style={[
                          styles.templateItem,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.background,
                            borderColor: isSelected ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => toggleTemplateSelection(template.id)}
                      >
                        <Text
                          style={[
                            styles.templateItemText,
                            {
                              color: isSelected ? 'white' : colors.text,
                            },
                          ]}
                        >
                          {template.name}
                        </Text>
                        {isSelected && selectionOrder !== null && (
                          <View style={styles.selectionBadge}>
                            <Text style={styles.selectionBadgeText}>{selectionOrder}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
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
          {t('programsTitle')}
        </Text>
        <TouchableOpacity onPress={handleCreate} style={styles.addButton}>
          <Text style={[styles.addButtonText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Zorunlu mod bilgilendirmesi */}
      {isRequiredMode && (
        <View style={[styles.requiredModeBanner, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
          <Text style={[styles.requiredModeText, { color: colors.text }]}>
            {t('premiumOnboardingProgramRequired')} ({programs.length}/{minRequiredCount})
          </Text>
        </View>
      )}

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : programs.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📅</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('programsEmpty')}</Text>
            <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
              {t('programsEmptyMessage')}
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleCreate}
            >
              <Text style={styles.createButtonText}>{t('programCreate')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          programs.map((program) => {
            const programTemplates = program.templates
              .map((id) => getTemplate(id))
              .filter((template): template is WorkoutTemplate => template !== undefined);
            
            return (
              <View
                key={program.id}
                style={[styles.programCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.programHeader}>
                  <View style={styles.programInfo}>
                    <Text style={[styles.programName, { color: colors.text }]}>{program.name}</Text>
                    {program.description && (
                      <Text style={[styles.programDescription, { color: colors.textSecondary }]}>
                        {program.description}
                      </Text>
                    )}
                    <Text style={[styles.programTemplatesCount, { color: colors.textSecondary }]}>
                      {programTemplates.length} {t('templates')}
                    </Text>
                  </View>
                  <View style={styles.programActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={() => handleUse(program)}
                    >
                      <Text style={styles.actionButtonText}>{t('programUse')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton, { backgroundColor: colors.border }]}
                      onPress={() => handleEdit(program)}
                    >
                      <Text style={[styles.actionButtonText, { color: colors.text }]}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton, { backgroundColor: colors.border }]}
                      onPress={() => handleDelete(program)}
                    >
                      <Text style={[styles.actionButtonText, { color: colors.text }]}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
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
  textArea: {
    minHeight: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  templatesList: {
    maxHeight: 200,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  templateItemText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  selectionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },
  selectionBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  emptyTemplates: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyTemplatesText: {
    fontSize: 14,
    textAlign: 'center',
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
  programCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  programInfo: {
    flex: 1,
    gap: 4,
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
  },
  programDescription: {
    fontSize: 14,
  },
  programTemplatesCount: {
    fontSize: 12,
    marginTop: 4,
  },
  programActions: {
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

