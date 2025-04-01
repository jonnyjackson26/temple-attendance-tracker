import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, Temple, Visit } from '../types';
import { temples as mockTemples } from '../mocks/temples';

interface TempleState {
  temples: Temple[];
  visits: Visit[];
  goals: {
    weeklyVisits: number;
    monthlyVisits: number;
  };
  favoriteTemples: string[];
  addVisit: (visit: Omit<Visit, 'id'>) => void;
  setTemples: (temples: Temple[]) => void;
  getAllTemples: () => Temple[];
  getFavoriteTemples: () => Temple[];
  toggleFavoriteTemple: (templeId: string) => void;
}

export const useTempleStore = create<TempleState>()(
  persist(
    (set, get) => ({
      temples: [],
      visits: [],
      favoriteTemples: [],
      goals: {
        weeklyVisits: 0,
        monthlyVisits: 0,
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

      addVisit: (visitData) => {
        set((state) => ({
          visits: [
            ...state.visits,
            {
              ...visitData,
              id: Math.random().toString(36).substr(2, 9),
            },
          ],
        }));
      },

      setTemples: (temples: Temple[]) => {
        set({ temples });
      },

      // ... other methods ...
    }),
    {
      name: 'temple-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 