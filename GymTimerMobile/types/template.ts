// Antrenman Şablonu (Workout Template)
export interface WorkoutTemplate {
  id: string;
  name: string;
  setCount: number;
  setDuration: number; // saniye
  restDuration: number; // saniye
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

