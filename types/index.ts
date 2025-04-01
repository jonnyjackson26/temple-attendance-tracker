export interface Temple {
  id: string;
  name: string;
  location: string;
  image: string;
  favorite: boolean;
}

export interface TempleVisit {
  id: string;
  templeId: string;
  date: string;
  notes?: string;
}

export interface AppState {
  visits: TempleVisit[];
  favoriteTemples: string[];
  goals: {
    weeklyVisits: number;
    monthlyVisits: number;
  };
} 