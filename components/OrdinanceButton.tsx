import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Ordinance } from '@/types';
import Colors from '@/constants/Colors';
import * as Icons from 'lucide-react-native';

interface OrdinanceButtonProps {
  ordinance: Ordinance;
  selected: boolean;
  onPress: () => void;
}

export default function OrdinanceButton({ ordinance, selected, onPress }: OrdinanceButtonProps) {
  const IconComponent = (Icons as any)[ordinance.icon.charAt(0).toUpperCase() + ordinance.icon.slice(1)];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        {IconComponent && (
          <IconComponent
            size={24}
            color={selected ? Colors.light.background : Colors.light.tint}
          />
        )}
      </View>
      <Text style={[styles.text, selected && styles.selectedText]}>
        {ordinance.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: Colors.light.background,
  },
  text: {
    fontSize: 18,
    color: Colors.light.text,
    flex: 1,
  },
  selectedText: {
    color: Colors.light.background,
    fontWeight: '500',
  },
}); 