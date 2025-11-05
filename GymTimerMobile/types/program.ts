// Antrenman Programı (Workout Program)
export interface WorkoutProgram {
  id: string;
  name: string;
  description?: string;
  templates: string[]; // Template ID'leri
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

