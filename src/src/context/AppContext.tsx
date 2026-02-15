import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Medication,
  Appointment,
  MessageTemplate,
  Contact,
  AppSettings,
  RefillRequest,
  WellnessEntry,
} from '../types';

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Medications
  medications: Medication[];
  addMedication: (medication: Omit<Medication, 'id' | 'history'>) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  takeMedication: (id: string, user: string) => void;
  skipMedication: (id: string, user: string) => void;
  undoLastMedicationAction: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;

  // Refills
  refillRequests: RefillRequest[];
  createRefillRequest: (medicationId: string) => void;
  updateRefillRequest: (id: string, updates: Partial<RefillRequest>) => void;

  // Wellness
  wellnessEntries: WellnessEntry[];
  addWellnessEntry: (entry: Omit<WellnessEntry, 'id'>) => void;

  // Static data
  messageTemplates: MessageTemplate[];
  contacts: Contact[];

  // Favorites
  favorites: string[];
  toggleFavorite: (path: string) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: '@careconnect:auth',
  SETTINGS: '@careconnect:settings',
  MEDICATIONS: '@careconnect:medications',
  APPOINTMENTS: '@careconnect:appointments',
  REFILLS: '@careconnect:refills',
  WELLNESS: '@careconnect:wellness',
  FAVORITES: '@careconnect:favorites',
  ONBOARDING: '@careconnect:onboarding',
};

const DEFAULT_SETTINGS: AppSettings = {
  leftHandMode: false,
  biometricEnabled: true,
  notificationLeadTime: 30,
  sessionTimeout: 15,
  textSize: 'medium',
  highContrast: false,
};

const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dose: '10mg',
    frequency: 'Once daily',
    times: ['09:00'],
    refillsRemaining: 2,
    pharmacy: 'CVS Pharmacy - Main St',
    history: [],
  },
  {
    id: '2',
    name: 'Metformin',
    dose: '500mg',
    frequency: 'Twice daily',
    times: ['08:00', '20:00'],
    refillsRemaining: 1,
    pharmacy: 'CVS Pharmacy - Main St',
    history: [],
  },
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Dr. Smith - Follow-up',
    date: '2026-02-20',
    time: '14:00',
    location: 'City Medical Center',
    provider: 'Dr. Sarah Smith',
  },
  {
    id: '2',
    title: 'Physical Therapy',
    date: '2026-02-21',
    time: '10:30',
    location: 'Rehab Center',
    provider: 'John Davis, PT',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [medications, setMedications] = useState<Medication[]>(DEFAULT_MEDICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['/medications', '/appointments']);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Message templates (static)
  const messageTemplates: MessageTemplate[] = [
    { id: '1', text: 'Running late, will be there in 15 minutes', category: 'appointment' },
    { id: '2', text: 'Medication taken as scheduled', category: 'update' },
    { id: '3', text: 'Need to reschedule appointment', category: 'appointment' },
    { id: '4', text: 'Feeling better today', category: 'wellness' },
    { id: '5', text: 'Not feeling well, need assistance', category: 'urgent' },
  ];

  // Contacts (static)
  const contacts: Contact[] = [
    { id: '1', name: 'Dr. Sarah Smith', role: 'Primary Care', phone: '555-0100' },
    { id: '2', name: 'John Davis, PT', role: 'Physical Therapist', phone: '555-0200' },
    { id: '3', name: 'Care Coordinator', role: 'Support', phone: '555-0300' },
  ];


  const loadData = async () => {
    try {
      const [
        authData,
        settingsData,
        medicationsData,
        appointmentsData,
        refillsData,
        wellnessData,
        favoritesData,
        onboardingData,
      ] = await AsyncStorage.multiGet([
        STORAGE_KEYS.AUTH,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.MEDICATIONS,
        STORAGE_KEYS.APPOINTMENTS,
        STORAGE_KEYS.REFILLS,
        STORAGE_KEYS.WELLNESS,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.ONBOARDING,
      ]);

      if (authData[1]) setIsAuthenticated(JSON.parse(authData[1]));
      if (settingsData[1]) setSettings(JSON.parse(settingsData[1]));
      if (medicationsData[1]) setMedications(JSON.parse(medicationsData[1]));
      if (appointmentsData[1]) setAppointments(JSON.parse(appointmentsData[1]));
      if (refillsData[1]) setRefillRequests(JSON.parse(refillsData[1]));
      if (wellnessData[1]) setWellnessEntries(JSON.parse(wellnessData[1]));
      if (favoritesData[1]) setFavorites(JSON.parse(favoritesData[1]));
      if (onboardingData[1]) setHasCompletedOnboarding(JSON.parse(onboardingData[1]));

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoaded(true);
    }
  };

  const saveData = useCallback(async () => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated)],
        [STORAGE_KEYS.SETTINGS, JSON.stringify(settings)],
        [STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications)],
        [STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments)],
        [STORAGE_KEYS.REFILLS, JSON.stringify(refillRequests)],
        [STORAGE_KEYS.WELLNESS, JSON.stringify(wellnessEntries)],
        [STORAGE_KEYS.FAVORITES, JSON.stringify(favorites)],
        [STORAGE_KEYS.ONBOARDING, JSON.stringify(hasCompletedOnboarding)],
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [
    isAuthenticated,
    settings,
    medications,
    appointments,
    refillRequests,
    wellnessEntries,
    favorites,
    hasCompletedOnboarding,
  ]);
  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [isLoaded, saveData]);

  // Auth functions
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  // Settings functions
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Medication functions
  const addMedication = (medication: Omit<Medication, 'id' | 'history'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString(),
      history: [],
    };
    setMedications((prev) => [...prev, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, ...updates } : med))
    );
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  };

  const takeMedication = (id: string, user: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          return {
            ...med,
            lastTaken: { timestamp: new Date().toISOString(), user },
            history: [
              ...med.history,
              { timestamp: new Date().toISOString(), action: 'taken' as const, user },
            ],
          };
        }
        return med;
      })
    );
  };

  const skipMedication = (id: string, user: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id) {
          return {
            ...med,
            history: [
              ...med.history,
              { timestamp: new Date().toISOString(), action: 'skipped' as const, user },
            ],
          };
        }
        return med;
      })
    );
  };

  const undoLastMedicationAction = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === id && med.history.length > 0) {
          const newHistory = [...med.history];
          newHistory.pop();
          return {
            ...med,
            history: newHistory,
            lastTaken:
              newHistory.length > 0 && newHistory[newHistory.length - 1].action === 'taken'
                ? {
                    timestamp: newHistory[newHistory.length - 1].timestamp,
                    user: newHistory[newHistory.length - 1].user,
                  }
                : undefined,
          };
        }
        return med;
      })
    );
  };

  // Appointment functions
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  };

  // Refill functions
  const createRefillRequest = (medicationId: string) => {
    const medication = medications.find((m) => m.id === medicationId);
    if (!medication) return;

    const newRefill: RefillRequest = {
      id: Date.now().toString(),
      medicationId,
      medicationName: medication.name,
      status: 'pending',
      requestDate: new Date().toISOString(),
      pharmacy: medication.pharmacy,
      step: 1,
    };
    setRefillRequests((prev) => [...prev, newRefill]);
  };

  const updateRefillRequest = (id: string, updates: Partial<RefillRequest>) => {
    setRefillRequests((prev) =>
      prev.map((refill) => (refill.id === id ? { ...refill, ...updates } : refill))
    );
  };

  // Wellness functions
  const addWellnessEntry = (entry: Omit<WellnessEntry, 'id'>) => {
    const newEntry: WellnessEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setWellnessEntries((prev) => [...prev, newEntry]);
  };

  // Favorites functions
  const toggleFavorite = (path: string) => {
    setFavorites((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  // Onboarding functions
  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const value: AppContextType = {
    isAuthenticated,
    login,
    logout,
    settings,
    updateSettings,
    medications,
    addMedication,
    updateMedication,
    deleteMedication,
    takeMedication,
    skipMedication,
    undoLastMedicationAction,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refillRequests,
    createRefillRequest,
    updateRefillRequest,
    wellnessEntries,
    addWellnessEntry,
    messageTemplates,
    contacts,
    favorites,
    toggleFavorite,
    hasCompletedOnboarding,
    completeOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
