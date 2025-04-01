import { create } from 'zustand';

interface TempleState {
  goals: {
    weeklyVisits: number;
    monthlyVisits: number;
  };
  updateGoals: (goals: { weeklyVisits: number; monthlyVisits: number }) => void;
}

export const useTempleStore = create<TempleState>((set) => ({
  goals: {
    weeklyVisits: 1,
    monthlyVisits: 4,
  },
  updateGoals: (newGoals) => set({ goals: newGoals }),
})); 