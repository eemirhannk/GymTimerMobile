// Antrenman veri yapısı
export interface Workout {
  id: string;
  date: number; // Timestamp
  setCount: number;
  setDuration: number; // saniye
  restDuration: number; // saniye
  totalDuration: number; // Toplam antrenman süresi (saniye)
  completedSets: number; // Tamamlanan set sayısı
}

// İstatistik veri yapısı
export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalDuration: number; // Toplam süre (saniye)
  averageDuration: number; // Ortalama antrenman süresi (saniye)
  averageSets: number; // Ortalama set sayısı
  longestWorkout: number; // En uzun antrenman (saniye)
  shortestWorkout: number; // En kısa antrenman (saniye)
  weeklyData: {
    date: string; // YYYY-MM-DD formatında
    workouts: number;
    totalSets: number;
    totalDuration: number;
  }[];
  monthlyData: {
    month: string; // YYYY-MM formatında
    workouts: number;
    totalSets: number;
    totalDuration: number;
  }[];
}

