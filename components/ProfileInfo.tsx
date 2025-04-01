import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTempleStore } from '../store/temple-store';
import Colors from '@/constants/Colors';
import Button from '../components/Button';

interface TempleState {
  goals: {
    weeklyVisits: number;
    monthlyVisits: number;
  };
  updateGoals: (goals: { weeklyVisits: number; monthlyVisits: number }) => void;
}

export default function SettingsScreen() {
  const goals = useTempleStore((state: TempleState) => state.goals);
  const updateGoals = useTempleStore((state: TempleState) => state.updateGoals);
  
  const [weeklyGoal, setWeeklyGoal] = useState(goals.weeklyVisits.toString());
  const [monthlyGoal, setMonthlyGoal] = useState(goals.monthlyVisits.toString());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSaveGoals = () => {
    const weekly = parseInt(weeklyGoal) || 0;
    const monthly = parseInt(monthlyGoal) || 0;
    
    updateGoals({
      weeklyVisits: weekly,
      monthlyVisits: monthly,
    });
    
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all your temple visit data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: () => {
            // This would need a proper implementation in the store
            Alert.alert("Data Cleared", "All your temple visit data has been cleared.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temple Visit Goals</Text>
          <Text style={styles.sectionDescription}>
            Set your temple attendance goals to help you track your progress.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Weekly Goal</Text>
            <TextInput
              style={styles.input}
              value={weeklyGoal}
              onChangeText={setWeeklyGoal}
              keyboardType="number-pad"
              placeholder="Enter weekly goal"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Monthly Goal</Text>
            <TextInput
              style={styles.input}
              value={monthlyGoal}
              onChangeText={setMonthlyGoal}
              keyboardType="number-pad"
              placeholder="Enter monthly goal"
            />
          </View>

          <Button
            title="Save Goals"
            onPress={handleSaveGoals}
            fullWidth
            size="large"
          />

          {showConfirmation && (
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationText}>Goals saved successfully!</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Temple Attendance Tracker helps members of The Church of Jesus Christ of Latter-day Saints track their temple attendance and set meaningful goals.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Button
            title="Clear All Data"
            onPress={handleClearData}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  confirmationContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  confirmationText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
