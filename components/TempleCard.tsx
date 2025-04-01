import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Temple } from '../types';
import Colors from '@/constants/Colors';

interface TempleCardProps {
  temple: Temple;
  onPress?: () => void;
  onHeartPress?: () => void;
}

export default function TempleCard({ temple, onPress, onHeartPress }: TempleCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/temple/${temple.id}`);
    }
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    if (onHeartPress) {
      onHeartPress();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <Image source={{ uri: temple.image }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.name}>{temple.name}</Text>
        <Text style={styles.location}>{temple.location}</Text>
      </View>
      <Pressable
        style={styles.favoriteButton}
        onPress={handleFavoritePress}
        hitSlop={10}
      >
        <Heart
          size={24}
          color={temple.favorite ? Colors.light.accent : Colors.light.secondary}
          fill={temple.favorite ? Colors.light.accent : 'transparent'}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    height: 160,
    position: 'relative',
    backgroundColor: Colors.light.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  name: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
}); 