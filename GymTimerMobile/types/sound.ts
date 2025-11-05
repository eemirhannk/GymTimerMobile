// Gelişmiş Ses Ayarları (Advanced Sound Settings)
export interface AdvancedSoundSettings {
  // Ses efektleri enable/disable
  workSoundEnabled: boolean; // Work sesi aktif/pasif (varsayılan: true)
  restSoundEnabled: boolean; // Rest sesi aktif/pasif (varsayılan: true)
  congratsSoundEnabled: boolean; // Congrats sesi aktif/pasif (varsayılan: true)
  
  // Özel ses efektleri (ileride eklenebilir)
  customSounds?: {
    work?: string; // Ses dosyası yolu
    rest?: string;
    congrats?: string;
  };
}

