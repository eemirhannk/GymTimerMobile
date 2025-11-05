import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { formatTime } from '../utils/timeFormatter';

type StatsScreenProps = {
  onBack: () => void;
};

export default function StatsScreen({ onBack }: StatsScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { workouts, isLoading, getStats } = useWorkoutHistory();

  const stats = useMemo(() => getStats(), [getStats]);

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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {t('premiumLoading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('statsTitle')}
        </Text>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.closeButton, { backgroundColor: colors.border }]}
        >
          <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {stats.totalWorkouts === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📊</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('statsEmptyTitle')}</Text>
            <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
              {t('statsEmptyMessage')}
            </Text>
          </View>
        ) : (
          <>
            {/* Genel İstatistikler */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('statsOverview')}
              </Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {stats.totalWorkouts}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('statsTotalWorkouts')}
                  </Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {stats.totalSets}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('statsTotalSets')}
                  </Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {formatDuration(stats.totalDuration)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('statsTotalDuration')}
                  </Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {formatDuration(stats.averageDuration)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('statsAverageDuration')}
                  </Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {stats.averageSets.toFixed(1)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('statsAverageSets')}
                  </Text>
                </View>
                
                <View style={styles.statCard}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {formatDuration(stats.longestWorkout)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    {t('statsLongestWorkout')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Son Antrenmanlar */}
            <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('statsRecentWorkouts')}
              </Text>
              
              {workouts.slice(0, 10).map((workout) => (
                <View
                  key={workout.id}
                  style={[styles.workoutCard, { backgroundColor: colors.background, borderColor: colors.border }]}
                >
                  <View style={styles.workoutHeader}>
                    <Text style={[styles.workoutDate, { color: colors.text }]}>
                      {formatDate(workout.date)}
                    </Text>
                    <Text style={[styles.workoutDuration, { color: colors.primary }]}>
                      {formatDuration(workout.totalDuration)}
                    </Text>
                  </View>
                  
                  <View style={styles.workoutDetails}>
                    <Text style={[styles.workoutDetail, { color: colors.textSecondary }]}>
                      {workout.completedSets} {t('sets')} • {formatTime(workout.setDuration)} / {formatTime(workout.restDuration)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
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
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
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
    flexDirection: 'row',
    gap: 8,
  },
  workoutDetail: {
    fontSize: 14,
  },
});

