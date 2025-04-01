import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Calendar, Building2, Clock, Award } from 'lucide-react-native';
import { useTempleStore } from '../store/temple-store';
import Colors from '@/constants/Colors';
import VisitCard from './VisitCard';
import StatCard from './StatCard';
import Button from './Button';
import EmptyState from './EmptyState';

export default function HomeScreenInfo() {
  const router = useRouter();
  const allVisits = useTempleStore((state) => state.visits);
  const goals = useTempleStore((state) => state.goals);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate recent visits using useMemo
  const recentVisits = useMemo(() => {
    return [...allVisits]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [allVisits]);

  const visitsThisMonth = useMemo(() => {
    return allVisits.filter((visit) => {
      const visitDate = new Date(visit.date);
      return visitDate.getMonth() === currentMonth && 
             visitDate.getFullYear() === currentYear;
    }).length;
  }, [allVisits, currentMonth, currentYear]);

  // Use useMemo to avoid recalculating on every render
  const weeklyVisits = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return allVisits.filter((visit) => {
      const visitDate = new Date(visit.date);
      return visitDate >= oneWeekAgo;
    }).length;
  }, [allVisits]);

  const weeklyGoalProgress = goals.weeklyVisits > 0 
    ? Math.min(100, (weeklyVisits / goals.weeklyVisits) * 100) 
    : 0;
  
  const monthlyGoalProgress = goals.monthlyVisits > 0 
    ? Math.min(100, (visitsThisMonth / goals.monthlyVisits) * 100) 
    : 0;

  const handleAddVisit = () => {
    router.push('/add-visit');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Temple Attendance</Text>
          <Button 
            title="Add Visit" 
            onPress={handleAddVisit}
            icon={<Plus size={20} color={Colors.light.background} />}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="This Week"
            value={`${weeklyVisits}/${goals.weeklyVisits}`}
            icon={<Calendar size={24} color={Colors.light.tint} />}
          />
          <StatCard
            title="This Month"
            value={`${visitsThisMonth}/${goals.monthlyVisits}`}
            icon={<Calendar size={24} color={Colors.light.accent} />}
            color={Colors.light.accent}
          />
          <StatCard
            title="Total Visits"
            value={allVisits.length}
            icon={<Award size={24} color={Colors.light.success} />}
            color={Colors.light.success}
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Goal Progress</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Weekly Goal</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${weeklyGoalProgress}%`, backgroundColor: Colors.light.tint }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{`${weeklyVisits} of ${goals.weeklyVisits} visits`}</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Monthly Goal</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${monthlyGoalProgress}%`, backgroundColor: Colors.light.accent }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{`${visitsThisMonth} of ${goals.monthlyVisits} visits`}</Text>
          </View>
        </View>

        <View style={styles.recentVisitsSection}>
          <Text style={styles.sectionTitle}>Recent Visits</Text>
          
          {recentVisits.length > 0 ? (
            recentVisits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} />
            ))
          ) : (
            <EmptyState
              title="No Temple Visits Yet"
              description="Record your temple attendance to see it here."
              icon={<Building2 size={48} color={Colors.light.tint} />}
              actionLabel="Add First Visit"
              onAction={handleAddVisit}
            />
          )}
        </View>
      </ScrollView>

      <Pressable 
        style={styles.floatingButton}
        onPress={handleAddVisit}
      >
        <Plus size={24} color={Colors.light.background} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  statsContainer: {
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Colors.light.secondary,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: Colors.light.textLight,
  },
  recentVisitsSection: {
    marginBottom: 24,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
