import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Temple } from '../types';
import { temples as mockTemples } from '../mocks/temples';

interface TempleStore extends AppState {
  // ... other methods ...
  getAllTemples: () => Temple[];
  getFavoriteTemples: () => Temple[];
  toggleFavoriteTemple: (templeId: string) => void;
}

export const useTempleStore = create<TempleStore>()(
  persist(
    (set, get) => ({
      visits: [],
      favoriteTemples: [],
      goals: {
        weeklyVisits: 1,
        monthlyVisits: 4,
      },

      getAllTemples: () => {
        const favorites = get().favoriteTemples;
        return mockTemples.map(temple => ({
          ...temple,
          favorite: favorites.includes(temple.id)
        }));
      },

      getFavoriteTemples: () => {
        const favorites = get().favoriteTemples;
        return mockTemples
          .filter(temple => favorites.includes(temple.id))
          .map(temple => ({ ...temple, favorite: true }));
      },

      toggleFavoriteTemple: (templeId: string) => 
        set((state) => {
          const isFavorite = state.favoriteTemples.includes(templeId);
          return {
            favoriteTemples: isFavorite
              ? state.favoriteTemples.filter(id => id !== templeId)
              : [...state.favoriteTemples, templeId]
          };
        }),

      // ... other methods ...
    }),
    {
      name: 'temple-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 