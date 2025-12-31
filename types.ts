
export interface Meal {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

export interface Selection {
  id: string;
  userName: string;
  mealIds: string[];
  timestamp: number;
}

export interface DailyMenu {
  id: string;
  date: string;
  meals: Meal[];
  uploadedAt: number;
}

export interface ActivityLog {
  id: string;
  type: 'UPLOAD' | 'SELECTION' | 'DELETE';
  message: string;
  timestamp: number;
  user: string;
}

export enum AppMode {
  COLLEAGUE = 'COLLEAGUE',
  ADMIN = 'ADMIN'
}
