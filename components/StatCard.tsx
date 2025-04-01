import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color = Colors.light.tint }: StatCardProps) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: Colors.light.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    marginLeft: 16,
  },
}); 