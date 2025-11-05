import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutProgram } from '../types/program';
import { PREMIUM } from '../utils/constants';

export const useWorkoutPrograms = () => {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Programları yükle
  const loadPrograms = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PREMIUM.PROGRAMS_STORAGE_KEY);
      if (stored) {
        const parsedPrograms = JSON.parse(stored) as WorkoutProgram[];
        // Güncelleme tarihine göre sırala (en yeni önce)
        const sorted = parsedPrograms.sort((a, b) => b.updatedAt - a.updatedAt);
        setPrograms(sorted);
      } else {
        setPrograms([]);
      }
    } catch (error) {
      console.error('Error loading workout programs:', error);
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Program kaydet
  const saveProgram = useCallback(async (program: Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProgram: WorkoutProgram = {
        ...program,
        id: `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setPrograms((prevPrograms) => {
        const updatedPrograms = [newProgram, ...prevPrograms];
        // Son 50 programı sakla (storage limiti için)
        const limitedPrograms = updatedPrograms.slice(0, 50);
        
        // AsyncStorage'a kaydet
        AsyncStorage.setItem(
          PREMIUM.PROGRAMS_STORAGE_KEY,
          JSON.stringify(limitedPrograms)
        ).catch((error) => {
          console.error('Error saving program to storage:', error);
        });
        
        return limitedPrograms;
      });
      
      return newProgram;
    } catch (error) {
      console.error('Error saving program:', error);
      throw error;
    }
  }, []);

  // Program güncelle
  const updateProgram = useCallback(async (id: string, updates: Partial<Omit<WorkoutProgram, 'id' | 'createdAt'>>) => {
    try {
      setPrograms((prevPrograms) => {
        const updatedPrograms = prevPrograms.map((program) =>
          program.id === id
            ? { ...program, ...updates, updatedAt: Date.now() }
            : program
        );
        
        // AsyncStorage'a kaydet
        AsyncStorage.setItem(
          PREMIUM.PROGRAMS_STORAGE_KEY,
          JSON.stringify(updatedPrograms)
        ).catch((error) => {
          console.error('Error updating program in storage:', error);
        });
        
        return updatedPrograms;
      });
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  }, []);

  // Program sil
  const deleteProgram = useCallback(async (id: string) => {
    try {
      setPrograms((prevPrograms) => {
        const updatedPrograms = prevPrograms.filter((program) => program.id !== id);
        
        // AsyncStorage'a kaydet
        AsyncStorage.setItem(
          PREMIUM.PROGRAMS_STORAGE_KEY,
          JSON.stringify(updatedPrograms)
        ).catch((error) => {
          console.error('Error deleting program from storage:', error);
        });
        
        return updatedPrograms;
      });
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  }, []);

  // Program getir
  const getProgram = useCallback((id: string): WorkoutProgram | undefined => {
    return programs.find((program) => program.id === id);
  }, [programs]);

  return {
    programs,
    isLoading,
    saveProgram,
    updateProgram,
    deleteProgram,
    getProgram,
    loadPrograms,
  };
};

