import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutStats } from '../types/workout';
import { PREMIUM } from '../utils/constants';

export const useWorkoutHistory = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Antrenman geçmişini yükle
  const loadWorkouts = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PREMIUM.WORKOUTS_STORAGE_KEY);
      if (stored) {
        const parsedWorkouts = JSON.parse(stored) as Workout[];
        // Tarihe göre sırala (en yeni önce)
        const sorted = parsedWorkouts.sort((a, b) => b.date - a.date);
        setWorkouts(sorted);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // İlk yükleme
  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  // Antrenman kaydet
  // Functional update pattern kullanarak güncel workouts state'ini garanti et
  const saveWorkout = useCallback(async (workout: Omit<Workout, 'id' | 'date'>) => {
    try {
      const newWorkout: Workout = {
        ...workout,
        id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: Date.now(),
      };

      // Functional update kullanarak güncel state'i garanti et
      setWorkouts((prevWorkouts) => {
        const updatedWorkouts = [newWorkout, ...prevWorkouts];
        // Son 1000 antrenmanı sakla (storage limiti için)
        const limitedWorkouts = updatedWorkouts.slice(0, 1000);
        
        // AsyncStorage'a kaydet (state güncellemesinden bağımsız)
        AsyncStorage.setItem(
          PREMIUM.WORKOUTS_STORAGE_KEY,
          JSON.stringify(limitedWorkouts)
        ).catch((error) => {
          console.error('Error saving workout to storage:', error);
        });
        
        return limitedWorkouts;
      });
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }, []);

  // İstatistikleri hesapla
  const getStats = useCallback((): WorkoutStats => {
    if (workouts.length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        totalDuration: 0,
        averageDuration: 0,
        averageSets: 0,
        longestWorkout: 0,
        shortestWorkout: 0,
        weeklyData: [],
        monthlyData: [],
      };
    }

    const totalSets = workouts.reduce((sum, w) => sum + w.completedSets, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.totalDuration, 0);
    const averageDuration = totalDuration / workouts.length;
    const averageSets = totalSets / workouts.length;
    const durations = workouts.map(w => w.totalDuration);
    const longestWorkout = Math.max(...durations);
    const shortestWorkout = Math.min(...durations);

    // Haftalık veri
    const weeklyMap = new Map<string, { workouts: number; totalSets: number; totalDuration: number }>();
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Haftanın başlangıcı
      const weekKey = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD

      const existing = weeklyMap.get(weekKey) || { workouts: 0, totalSets: 0, totalDuration: 0 };
      weeklyMap.set(weekKey, {
        workouts: existing.workouts + 1,
        totalSets: existing.totalSets + workout.completedSets,
        totalDuration: existing.totalDuration + workout.totalDuration,
      });
    });

    const weeklyData = Array.from(weeklyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 12); // Son 12 hafta

    // Aylık veri
    const monthlyMap = new Map<string, { workouts: number; totalSets: number; totalDuration: number }>();
    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const existing = monthlyMap.get(monthKey) || { workouts: 0, totalSets: 0, totalDuration: 0 };
      monthlyMap.set(monthKey, {
        workouts: existing.workouts + 1,
        totalSets: existing.totalSets + workout.completedSets,
        totalDuration: existing.totalDuration + workout.totalDuration,
      });
    });

    const monthlyData = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12); // Son 12 ay

    return {
      totalWorkouts: workouts.length,
      totalSets,
      totalDuration,
      averageDuration: Math.round(averageDuration),
      averageSets: Math.round(averageSets * 10) / 10,
      longestWorkout,
      shortestWorkout,
      weeklyData,
      monthlyData,
    };
  }, [workouts]);

  // Antrenman geçmişini temizle
  const clearWorkouts = useCallback(async () => {
    try {
      setWorkouts([]);
      await AsyncStorage.removeItem(PREMIUM.WORKOUTS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing workouts:', error);
    }
  }, []);

  return {
    workouts,
    isLoading,
    saveWorkout,
    getStats,
    clearWorkouts,
    loadWorkouts, // Yeniden yükleme fonksiyonu
  };
};

