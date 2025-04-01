import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import { useTempleStore } from '@/store/temple-store';
import { ordinances } from '@/constants/ordinances';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import OrdinanceButton from '@/components/OrdinanceButton';
import TempleCard from '@/components/TempleCard';

export default function AddVisitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialDate = params.date ? new Date(params.date as string) : new Date();
  
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTempleId, setSelectedTempleId] = useState<string | null>(null);
  const [selectedOrdinances, setSelectedOrdinances] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showTempleSelector, setShowTempleSelector] = useState(false);

  const temples = useTempleStore((state) => state.temples ?? []);
  const favoriteTemples = temples.filter(temple => temple.isFavorite);
  const addVisit = useTempleStore((state) => state.addVisit);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(selectedDate);
      newDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds()
      );
      setSelectedDate(newDate);
    }
  };

  const toggleOrdinance = (ordinanceId: string) => {
    setSelectedOrdinances((prev) =>
      prev.includes(ordinanceId)
        ? prev.filter((id) => id !== ordinanceId)
        : [...prev, ordinanceId]
    );
  };

  const handleTempleSelect = (templeId: string) => {
    setSelectedTempleId(templeId);
    setShowTempleSelector(false);
  };

  const handleSaveVisit = () => {
    if (!selectedTempleId) {
      alert('Please select a temple');
      return;
    }

    if (selectedOrdinances.length === 0) {
      alert('Please select at least one ordinance');
      return;
    }

    addVisit({
      date: selectedDate.toISOString(),
      templeId: selectedTempleId,
      ordinances: selectedOrdinances,
      notes: notes.trim() || undefined,
    });

    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const selectedTemple = temples.find((temple) => temple.id === selectedTempleId);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Temple Visit</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          
          <Button
            title={formatDate(selectedDate)}
            onPress={() => setShowDatePicker(true)}
            variant="outline"
            fullWidth
            icon={<Calendar size={20} color={Colors.light.tint} />}
          />
          
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          
          <View style={styles.spacer} />
          
          <Button
            title={formatTime(selectedDate)}
            onPress={() => setShowTimePicker(true)}
            variant="outline"
            fullWidth
            icon={<Clock size={20} color={Colors.light.tint} />}
          />
          
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temple</Text>
          
          {selectedTemple ? (
            <View>
              <TempleCard temple={selectedTemple} onPress={() => setShowTempleSelector(true)} />
              <Button
                title="Change Temple"
                onPress={() => setShowTempleSelector(true)}
                variant="outline"
                size="small"
              />
            </View>
          ) : (
            <Button
              title="Select Temple"
              onPress={() => setShowTempleSelector(true)}
              fullWidth
            />
          )}
          
          {showTempleSelector && (
            <View style={styles.templeSelectorContainer}>
              <Text style={styles.templeSelectorTitle}>Select a Temple</Text>
              
              {favoriteTemples.length > 0 && (
                <View>
                  <Text style={styles.templeSelectorSubtitle}>Favorites</Text>
                  {favoriteTemples.map((temple) => (
                    <TempleCard
                      key={temple.id}
                      temple={temple}
                      onPress={() => handleTempleSelect(temple.id)}
                    />
                  ))}
                </View>
              )}
              
              <Text style={styles.templeSelectorSubtitle}>All Temples</Text>
              {temples.map((temple) => (
                <TempleCard
                  key={temple.id}
                  temple={temple}
                  onPress={() => handleTempleSelect(temple.id)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ordinances</Text>
          <Text style={styles.sectionDescription}>
            Select the ordinances you participated in:
          </Text>
          
          {ordinances.map((ordinance) => (
            <OrdinanceButton
              key={ordinance.id}
              ordinance={ordinance}
              selected={selectedOrdinances.includes(ordinance.id)}
              onPress={() => toggleOrdinance(ordinance.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any thoughts or experiences..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Save Visit"
            onPress={handleSaveVisit}
            size="large"
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
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 16,
    color: Colors.light.textLight,
    marginBottom: 16,
  },
  spacer: {
    height: 16,
  },
  templeSelectorContainer: {
    marginTop: 16,
  },
  templeSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  templeSelectorSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: 8,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 120,
  },
  buttonContainer: {
    marginBottom: 24,
  },
}); 