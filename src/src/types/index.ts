export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  times: string[];
  refillsRemaining: number;
  pharmacy: string;
  lastTaken?: {
    timestamp: string;
    user: string;
  };
  history: MedicationHistoryEntry[];
}

export interface MedicationHistoryEntry {
  timestamp: string;
  action: 'taken' | 'skipped';
  user: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  provider: string;
}

export interface MessageTemplate {
  id: string;
  text: string;
  category: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone?: string;
}

export interface WellnessEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  energy: 'high' | 'medium' | 'low';
  pain: 'none' | 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface AppSettings {
  leftHandMode: boolean;
  biometricEnabled: boolean;
  notificationLeadTime: number; // minutes
  sessionTimeout: number; // minutes
  textSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
}

export type HandMode = 'left' | 'right';

export interface RefillRequest {
  id: string;
  medicationId: string;
  medicationName: string;
  status: 'pending' | 'processing' | 'ready' | 'completed';
  requestDate: string;
  pharmacy: string;
  step: 1 | 2 | 3; // 3-step refill process
}
