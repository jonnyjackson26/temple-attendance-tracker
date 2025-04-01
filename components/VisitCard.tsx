import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { TempleVisit } from '../types';
import { useTempleStore } from '../store/temple-store';
import { ordinances } from '../constants/ordinances';
import Colors from '@/constants/Colors';

interface VisitCardProps {
  visit: TempleVisit;
}

export default function VisitCard({ visit }: VisitCardProps) {
  const router = useRouter();
  const getTempleById = useTempleStore((state) => state.getTempleById);
  const temple = getTempleById(visit.templeId);

  if (!temple) return null;

  const visitDate = new Date(visit.date);
  const formattedDate = visitDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = visitDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const ordinanceNames = visit.ordinances
    .map((id) => ordinances.find((o) => o.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const handlePress = () => {
    router.push(`/visit/${visit.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={styles.templeName}>{temple.name}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.dateRow}>
          <Calendar size={18} color={Colors.light.tint} />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <View style={styles.dateRow}>
          <Clock size={18} color={Colors.light.tint} />
          <Text style={styles.date}>{formattedTime}</Text>
        </View>
        <View style={styles.ordinancesContainer}>
          <Text style={styles.ordinancesLabel}>Ordinances:</Text>
          <Text style={styles.ordinances}>{ordinanceNames}</Text>
        </View>
        {visit.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notes} numberOfLines={2}>
              {visit.notes}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    backgroundColor: Colors.light.tint,
    padding: 16,
  },
  templeName: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
  },
  ordinancesContainer: {
    marginTop: 8,
  },
  ordinancesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  ordinances: {
    fontSize: 16,
    color: Colors.light.textLight,
  },
  notesContainer: {
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  notes: {
    fontSize: 16,
    color: Colors.light.textLight,
  },
}); 