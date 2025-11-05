import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutTemplate } from '../types/template';
import { PREMIUM } from '../utils/constants';

export const useWorkoutTemplates = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Şablonları yükle
  const loadTemplates = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PREMIUM.TEMPLATES_STORAGE_KEY);
      if (stored) {
        const parsedTemplates = JSON.parse(stored) as WorkoutTemplate[];
        // Güncelleme tarihine göre sırala (en yeni önce)
        const sorted = parsedTemplates.sort((a, b) => b.updatedAt - a.updatedAt);
        setTemplates(sorted);
      } else {
        setTemplates([]);
      }
    } catch (error) {
      console.error('Error loading workout templates:', error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Şablon kaydet
  const saveTemplate = useCallback(async (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTemplate: WorkoutTemplate = {
        ...template,
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setTemplates((prevTemplates) => {
        const updatedTemplates = [newTemplate, ...prevTemplates];
        // Son 100 şablonu sakla (storage limiti için)
        const limitedTemplates = updatedTemplates.slice(0, 100);
        
        // AsyncStorage'a kaydet
        AsyncStorage.setItem(
          PREMIUM.TEMPLATES_STORAGE_KEY,
          JSON.stringify(limitedTemplates)
        ).catch((error) => {
          console.error('Error saving template to storage:', error);
        });
        
        return limitedTemplates;
      });
      
      return newTemplate;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }, []);

  // Şablon güncelle
  const updateTemplate = useCallback(async (id: string, updates: Partial<Omit<WorkoutTemplate, 'id' | 'createdAt'>>) => {
    try {
      setTemplates((prevTemplates) => {
        const updatedTemplates = prevTemplates.map((template) =>
          template.id === id
            ? { ...template, ...updates, updatedAt: Date.now() }
            : template
        );
        
        // AsyncStorage'a kaydet
        AsyncStorage.setItem(
          PREMIUM.TEMPLATES_STORAGE_KEY,
          JSON.stringify(updatedTemplates)
        ).catch((error) => {
          console.error('Error updating template in storage:', error);
        });
        
        return updatedTemplates;
      });
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }, []);

  // Şablon sil
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setTemplates((prevTemplates) => {
        const updatedTemplates = prevTemplates.filter((template) => template.id !== id);
        
        // AsyncStorage'a kaydet
        AsyncStorage.setItem(
          PREMIUM.TEMPLATES_STORAGE_KEY,
          JSON.stringify(updatedTemplates)
        ).catch((error) => {
          console.error('Error deleting template from storage:', error);
        });
        
        return updatedTemplates;
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }, []);

  // Şablon getir
  const getTemplate = useCallback((id: string): WorkoutTemplate | undefined => {
    return templates.find((template) => template.id === id);
  }, [templates]);

  return {
    templates,
    isLoading,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    loadTemplates,
  };
};

