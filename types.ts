// Add these interfaces if they don't exist already
export interface Ordinance {
  id: string;
  name: string;
  icon: string;
}

export interface Visit {
  id: string;
  date: string;
  templeId: string;
  ordinances: string[];
  notes?: string;
} 