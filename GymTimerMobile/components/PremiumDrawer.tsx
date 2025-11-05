import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { usePremium } from '../hooks/usePremium';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { premiumLightThemes, premiumDarkThemes, PremiumThemeName } from '../theme/colors';
import { formatTime } from '../utils/timeFormatter';

type DrawerView = 'menu' | 'themes' | 'workouts' | 'templates' | 'programs' | 'soundSettings';

type PremiumDrawerProps = {
  visible: boolean;
  onClose: () => void;
  selectedTheme: PremiumThemeName | null;
  onThemeSelect: (theme: PremiumThemeName | null) => void;
  onOpenStats?: () => void; // Geçmiş antrenmanlar için
  onOpenSoundSettings?: () => void;
  onOpenTemplates?: () => void;
  onOpenPrograms?: () => void;
};

import { DRAWER, WORKOUT } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * DRAWER.WIDTH_RATIO;

export default function PremiumDrawer({
  visible,
  onClose,
  selectedTheme,
  onThemeSelect,
  onOpenStats,
  onOpenSoundSettings,
  onOpenTemplates,
  onOpenPrograms,
}: PremiumDrawerProps) {
  const { t } = useTranslation();
  const { colors: themeColors, mode, isDark } = useTheme();
  const { isPremium } = usePremium();
  const { workouts, loadWorkouts } = useWorkoutHistory();
  const [drawerView, setDrawerView] = useState<DrawerView>('menu');
  
  // Drawer için seçili temaya göre dinamik renkler
  const drawerColors = themeColors;
  
  // Varsayılan tema için sabit renkler (seçili temadan bağımsız) - açık yeşil
  const defaultThemeColor = isDark ? '#34D399' : '#10B981'; // Açık yeşil renk (varsayılan tema için)
  
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Drawer açıldığında menüyü göster ve workout listesini yeniden yükle
      setDrawerView('menu');
      loadWorkouts(); // Workout listesini yeniden yükle
      
      // Animasyonları başlat
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animasyonları başlat
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, loadWorkouts]); // loadWorkouts dependency eklendi

  // Drawer render edilmeli ki animasyonlar çalışsın (visible false olsa bile)

  const themes = isDark ? premiumDarkThemes : premiumLightThemes;
  const themeNames: PremiumThemeName[] = ['azure', 'ember', 'midnight', 'slate'];

  const handleThemeSelect = (theme: PremiumThemeName) => {
    onThemeSelect(theme);
  };

  const handleDefaultTheme = () => {
    onThemeSelect(null);
  };

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0 dk';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} s ${minutes} dk`;
    }
    return `${minutes} dk`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const renderMenu = () => (
    <>
      <View style={[styles.header, { borderBottomColor: drawerColors.border }]}>
        <Text style={[styles.headerTitle, { color: drawerColors.text }]}>
          {t('premiumMenu')}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: drawerColors.border }]}
        >
          <Text style={[styles.closeButtonText, { color: drawerColors.text }]}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Temalar Menü Öğesi */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}
          onPress={() => setDrawerView('themes')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemInfo}>
              <Text style={[styles.menuItemTitle, { color: drawerColors.text }]}>
                {t('themes')}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: drawerColors.textSecondary }]}>
                {t('premiumThemesSubtitle')}
              </Text>
            </View>
          </View>
          <Text style={[styles.menuItemArrow, { color: drawerColors.textSecondary }]}>›</Text>
        </TouchableOpacity>

        {/* Geçmiş Antrenmanlar Menü Öğesi */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}
          onPress={() => setDrawerView('workouts')}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemInfo}>
              <Text style={[styles.menuItemTitle, { color: drawerColors.text }]}>
                {t('statsRecentWorkouts')}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: drawerColors.textSecondary }]}>
                {workouts.length} {t('workouts')}
              </Text>
            </View>
          </View>
          <Text style={[styles.menuItemArrow, { color: drawerColors.textSecondary }]}>›</Text>
        </TouchableOpacity>

        {/* Antrenman Şablonları Menü Öğesi */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}
          onPress={() => {
            onClose();
            onOpenTemplates?.();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemInfo}>
              <Text style={[styles.menuItemTitle, { color: drawerColors.text }]}>
                {t('templates')}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: drawerColors.textSecondary }]}>
                {t('templatesTitle')}
              </Text>
            </View>
          </View>
          <Text style={[styles.menuItemArrow, { color: drawerColors.textSecondary }]}>›</Text>
        </TouchableOpacity>

        {/* Antrenman Programları Menü Öğesi */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}
          onPress={() => {
            onClose();
            onOpenPrograms?.();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemInfo}>
              <Text style={[styles.menuItemTitle, { color: drawerColors.text }]}>
                {t('programs')}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: drawerColors.textSecondary }]}>
                {t('programsTitle')}
              </Text>
            </View>
          </View>
          <Text style={[styles.menuItemArrow, { color: drawerColors.textSecondary }]}>›</Text>
        </TouchableOpacity>

        {/* Gelişmiş Ses Ayarları Menü Öğesi */}
        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}
          onPress={() => {
            onClose();
            onOpenSoundSettings?.();
          }}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <View style={styles.menuItemInfo}>
              <Text style={[styles.menuItemTitle, { color: drawerColors.text }]}>
                {t('soundSettings')}
              </Text>
              <Text style={[styles.menuItemSubtitle, { color: drawerColors.textSecondary }]}>
                {t('soundSettingsTitle')}
              </Text>
            </View>
          </View>
          <Text style={[styles.menuItemArrow, { color: drawerColors.textSecondary }]}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );

  const renderThemes = () => (
    <>
      <View style={[styles.header, { borderBottomColor: drawerColors.border }]}>
        <TouchableOpacity
          onPress={() => setDrawerView('menu')}
          style={styles.backButton}
        >
          <Text style={[styles.backButtonText, { color: drawerColors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: drawerColors.text }]}>
          {t('themes')}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: drawerColors.border }]}
        >
          <Text style={[styles.closeButtonText, { color: drawerColors.text }]}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Default Theme */}
        <TouchableOpacity
          style={[
            styles.themeCard,
            {
              backgroundColor: drawerColors.surface,
              borderColor: selectedTheme === null ? defaultThemeColor : drawerColors.border,
              borderWidth: selectedTheme === null ? 2 : 1,
            },
          ]}
          onPress={handleDefaultTheme}
          activeOpacity={0.7}
        >
          <View style={[styles.themePreview, { backgroundColor: defaultThemeColor }]} />
          <Text style={[styles.themeName, { color: drawerColors.text }]}>
            {t('premiumThemeClassic')}
          </Text>
        </TouchableOpacity>

        {/* Premium Themes */}
        {themeNames.map((themeName) => {
          const themeColors = themes[themeName];
          const themeDisplayName = themeName.charAt(0).toUpperCase() + themeName.slice(1);
          return (
            <TouchableOpacity
              key={themeName}
              style={[
                styles.themeCard,
                {
                  backgroundColor: drawerColors.surface,
                  borderColor:
                    selectedTheme === themeName ? themeColors.primary : drawerColors.border,
                  borderWidth: selectedTheme === themeName ? 2 : 1,
                  opacity: !isPremium ? 0.6 : 1,
                },
              ]}
              onPress={() => {
                if (isPremium) {
                  handleThemeSelect(themeName);
                }
              }}
              activeOpacity={0.7}
              disabled={!isPremium}
            >
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: themeColors.primary },
                ]}
              />
              <View style={styles.themeInfo}>
                <Text style={[styles.themeName, { color: drawerColors.text }]}>
                  {t(`premiumTheme${themeDisplayName}`)}
                </Text>
                {!isPremium && (
                  <Text style={[styles.premiumBadge, { color: drawerColors.textSecondary }]}>
                    💎
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );

  const renderWorkouts = () => (
    <>
      <View style={[styles.header, { borderBottomColor: drawerColors.border }]}>
        <TouchableOpacity
          onPress={() => setDrawerView('menu')}
          style={styles.backButton}
        >
          <Text style={[styles.backButtonText, { color: drawerColors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: drawerColors.text }]}>
          {t('statsRecentWorkouts')}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeButton, { backgroundColor: drawerColors.border }]}
        >
          <Text style={[styles.closeButtonText, { color: drawerColors.text }]}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {workouts.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}>
            <Text style={[styles.emptyIcon, { color: drawerColors.textSecondary }]}>📊</Text>
            <Text style={[styles.emptyTitle, { color: drawerColors.text }]}>{t('statsEmptyTitle')}</Text>
            <Text style={[styles.emptyMessage, { color: drawerColors.textSecondary }]}>
              {t('statsEmptyMessage')}
            </Text>
          </View>
        ) : (
          workouts.map((workout) => (
            <View
              key={workout.id}
              style={[styles.workoutCard, { backgroundColor: drawerColors.surface, borderColor: drawerColors.border }]}
            >
              <View style={styles.workoutHeader}>
                <Text style={[styles.workoutDate, { color: drawerColors.text }]}>
                  {formatDate(workout.date)}
                </Text>
                <Text style={[styles.workoutDuration, { color: drawerColors.primary }]}>
                  {formatDuration(workout.totalDuration)}
                </Text>
              </View>
              
              <View style={styles.workoutDetails}>
                <Text style={[styles.workoutDetail, { color: drawerColors.textSecondary }]}>
                  {workout.completedSets} {t('sets')} • {t('setDurationLabel')}: {formatTime(workout.setDuration)} / {t('restDurationLabel')}: {formatTime(workout.restDuration)}
                </Text>
                {(() => {
                  // Eğer set süresi veya dinlenme süresi 0 ise (süresiz), tahmini toplam süre hesapla
                  const estimatedSetDuration = workout.setDuration === 0 ? WORKOUT.ESTIMATED_DURATION : workout.setDuration;
                  const estimatedRestDuration = workout.restDuration === 0 ? WORKOUT.ESTIMATED_DURATION : workout.restDuration;
                  const estimatedTotalSeconds = (estimatedSetDuration * workout.completedSets) + (estimatedRestDuration * (workout.completedSets - 1));
                  
                  // Tahmini hesaplama yapılıp yapılmadığını kontrol et
                  const isEstimated = workout.setDuration === 0 || workout.restDuration === 0;
                  
                  // Gerçek toplam süre varsa onu kullan, yoksa tahmini kullan
                  const displayDuration = workout.totalDuration > 0 ? workout.totalDuration : estimatedTotalSeconds;
                  const showEstimated = isEstimated && workout.totalDuration === 0;
                  
                  return (
                    <Text style={[styles.workoutDetail, { color: drawerColors.textSecondary }]}>
                      {t('totalDuration')}{showEstimated ? ' ≈' : ''}: {formatDuration(displayDuration)}
                    </Text>
                  );
                })()}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );

  // Drawer her zaman render edilmeli ki animasyonlar çalışsın
  // visible false olsa bile animasyon bitene kadar render edilmeli
  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: drawerColors.surface,
            transform: [{ translateX: slideAnim }],
          },
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <SafeAreaView style={styles.drawerContent} edges={['left', 'top', 'bottom']}>
          {drawerView === 'menu' && renderMenu()}
          {drawerView === 'themes' && renderThemes()}
          {drawerView === 'workouts' && renderWorkouts()}
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  menuItemIcon: {
    fontSize: 24,
  },
  menuItemInfo: {
    flex: 1,
    gap: 4,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  menuItemArrow: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
    marginTop: 32,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutDuration: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutDetails: {
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
  },
  workoutDetail: {
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  themeCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themePreview: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  themePreviewDisabled: {
    opacity: 0.5,
  },
  themeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  premiumBadge: {
    fontSize: 16,
  },
});
