import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Heart } from 'lucide-react-native';
import { useTempleStore } from '../store/temple-store';
import Colors from '@/constants/Colors';
import TempleCard from './TempleCard';
import { Temple } from '../types';

export default function TemplesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [displayedTemples, setDisplayedTemples] = useState<Temple[]>([]);
  
  // Get the temple functions directly
  const getAllTemples = useTempleStore(state => state.getAllTemples);
  const getFavoriteTemples = useTempleStore(state => state.getFavoriteTemples);
  const toggleFavoriteTemple = useTempleStore(state => state.toggleFavoriteTemple);
  
  // Function to refresh the temple list
  const refreshTemples = () => {
    const templeList = showFavoritesOnly ? getFavoriteTemples() : getAllTemples();
    console.log('Refreshing displayed temples, new length:', templeList.length);
    setDisplayedTemples(templeList);
  };
  
  // Effect to update temples based on filter
  useEffect(() => {
    console.log('Effect running with showFavoritesOnly:', showFavoritesOnly);
    refreshTemples();
  }, [showFavoritesOnly, getAllTemples, getFavoriteTemples]);
  
  // Filter temples based on search query
  const filteredTemples = useMemo(() => {
    console.log('Filtering temples with query:', searchQuery);
    if (!searchQuery.trim()) return displayedTemples;
    
    const filtered = displayedTemples.filter(
      (temple: Temple) =>
        temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Filtered temples length:', filtered.length);
    return filtered;
  }, [searchQuery, displayedTemples]);

  const handleToggleFavorites = () => {
    console.log('Toggling favorites, current state:', showFavoritesOnly);
    setShowFavoritesOnly(prev => !prev);
  };

  const handleToggleTempleHeart = (templeId: string) => {
    console.log('Toggling heart for temple:', templeId);
    toggleFavoriteTemple(templeId);
    
    // Immediately update displayed temples after toggling heart
    refreshTemples();
  };

  console.log('TemplesScreen rendering, showFavoritesOnly:', showFavoritesOnly);

  // Get the screen width
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={{ width: screenWidth }}
      >
        <Text style={styles.title}>Temples</Text>

        <View style={[styles.searchContainer, { width: '100%' }]}>
          <Search size={20} color={Colors.light.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search temples..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.textLight}
          />
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              showFavoritesOnly && styles.filterButtonActive,
              pressed && styles.filterButtonPressed
            ]}
            onPress={handleToggleFavorites}
          >
            <Heart
              size={16}
              color={showFavoritesOnly ? Colors.light.background : Colors.light.tint}
              fill={showFavoritesOnly ? Colors.light.background : 'transparent'}
            />
            <Text
              style={[
                styles.filterButtonText,
                showFavoritesOnly && styles.filterButtonTextActive,
              ]}
            >
              Favorites
            </Text>
          </Pressable>
        </View>

        <View style={styles.templesContainer}>
          {filteredTemples.length > 0 ? (
            filteredTemples.map((temple: Temple) => (
              <TempleCard 
                key={temple.id} 
                temple={temple}
                onHeartPress={() => handleToggleTempleHeart(temple.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {showFavoritesOnly
                  ? "You don't have any favorite temples yet."
                  : "No temples found matching your search."}
              </Text>
            </View>
          )}
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
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  filterLabel: {
    fontSize: 16,
    color: Colors.light.text,
    marginRight: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  filterButtonPressed: {
    backgroundColor: Colors.light.tint,
  },
  filterButtonText: {
    color: Colors.light.tint,
    fontWeight: '500',
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: Colors.light.background,
  },
  templesContainer: {
    marginBottom: 24,
    width: '100%',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
});
