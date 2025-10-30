import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      title: 'Gym Timer',
      back: '← Geri',
      start: 'Başla',
      restart: 'Yeniden Başla',
      setCount: 'Set Sayısı',
      setDuration: 'Set Süresi (saniye) - Opsiyonel',
      setHint: '0 girerseniz süre sınırı olmaz',
      restDuration: 'Dinlenme Süresi (saniye)',
      ph_example3: 'Örn: 3',
      ph_noLimit: '0 = süresiz',
      ph_example60: 'Örn: 60',
      totalSets: 'Toplam Set',
      workLabel: 'Çalışma',
      restLabel: 'Dinlenme',
      set: 'Set',
      workTime: '💪 Çalışma Zamanı',
      restTime: '😌 Dinlenme Zamanı',
      timeless: 'Süresiz',
      pause: 'Duraklat',
      resume: 'Devam Et',
      nextRest: 'Dinlenmeye Geç',
      reset: 'Sıfırla',
      speak_work: 'Çalışma Zamanı',
      speak_rest: 'Dinlenme Zamanı',
      speak_congrats: 'Tebrikler! Tüm setleri tamamladınız',
      speak_setWork: 'Set {{n}}. Çalışma Zamanı',
    },
  },
  en: {
    translation: {
      title: 'Gym Timer',
      back: '← Back',
      start: 'Start',
      restart: 'Restart',
      setCount: 'Set Count',
      setDuration: 'Set Duration (seconds) - Optional',
      setHint: 'If you enter 0, there is no limit',
      restDuration: 'Rest Duration (seconds)',
      ph_example3: 'Ex: 3',
      ph_noLimit: '0 = no limit',
      ph_example60: 'Ex: 60',
      totalSets: 'Total Sets',
      workLabel: 'Work',
      restLabel: 'Rest',
      set: 'Set',
      workTime: '💪 Work Time',
      restTime: '😌 Rest Time',
      timeless: 'Timeless',
      pause: 'Pause',
      resume: 'Resume',
      nextRest: 'Go To Rest',
      reset: 'Reset',
      speak_work: 'Work Time',
      speak_rest: 'Rest Time',
      speak_congrats: 'Congrats! All sets completed',
      speak_setWork: 'Set {{n}}. Work Time',
    },
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'tr',
    interpolation: { escapeValue: false },
  });

export default i18n;


