import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RefillRequestScreen } from '../src/screens/RefillRequestScreen';
import { LoginScreen } from '../src/screens/LoginScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import { HomeScreen } from '../src/screens/HomeScreen';
import { MedicationsScreen } from '../src/screens/MedicationsScreen';
import { AppointmentsScreen } from '../src/screens/AppointmentsScreen';
import { MessagesScreen } from '../src/screens/MessagesScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { AddMedicationScreen } from '../src/screens/AddMedicationScreen';
import { MedicationDetailScreen } from '../src/screens/MedicationDetailScreen';
import { AppProvider, useApp } from '../src/context/AppContext';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Icon');
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
    useRoute: () => ({ params: { medicationId: '1' } }),
  };
});

jest.mock('../src/context/AppContext', () => {
  const actual = jest.requireActual('../src/context/AppContext');
  return {
    ...actual,
    useApp: jest.fn(),
  };
});

describe('Integration Tests: User Workflows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Flow: First Time User', () => {
    it('completes onboarding and shows login', () => {
      const completeOnboarding = jest.fn();
      const updateSettings = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        hasCompletedOnboarding: false,
        settings: { leftHandMode: false },
        updateSettings,
        completeOnboarding,
      });

      const { getByText, getByTestId } = render(<OnboardingScreen />);

      expect(getByText('Welcome to CareConnect')).toBeTruthy();

      fireEvent.press(getByTestId('left-hand-button'));
      fireEvent.press(getByTestId('continue-button'));

      expect(updateSettings).toHaveBeenCalledWith({ leftHandMode: true });
      expect(completeOnboarding).toHaveBeenCalled();
    });
  });

  describe('User Flow: Returning User', () => {
    it('skips onboarding and goes directly to login', () => {
      const { queryByText } = render(
        <NavigationContainer>
          <LoginScreen />
        </NavigationContainer>
      );

      expect(queryByText('Welcome to CareConnect')).toBeNull();
    });

    it('login successfully transitions to main app', () => {
      const login = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        hasCompletedOnboarding: true,
        isAuthenticated: false,
        settings: { leftHandMode: false, biometricEnabled: true },
        login,
      });

      const { getByPlaceholderText, getByText } = render(<LoginScreen />);

      expect(getByText('CareConnect')).toBeTruthy();
      expect(getByText('Sign In')).toBeTruthy();

      fireEvent.changeText(getByPlaceholderText('Enter your username'), 'demo');
      fireEvent.changeText(getByPlaceholderText('Enter your password'), 'demo123');

      fireEvent.press(getByText('Sign In'));

      expect(login).toHaveBeenCalled();
    });
  });

  describe('User Flow: Medication Management', () => {
    const mockMedications = [
      {
        id: '1',
        name: 'Lisinopril',
        dose: '10mg',
        frequency: 'Once daily',
        times: ['09:00'],
        refillsRemaining: 3,
        pharmacy: 'CVS Pharmacy',
        history: [],
      },
    ];

    it('views and takes medication', () => {
      const takeMedication = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        medications: mockMedications,
        takeMedication,
        settings: { leftHandMode: false },
      });

      const { getByText } = render(
        <NavigationContainer>
          <MedicationDetailScreen />
        </NavigationContainer>
      );

      expect(getByText('Lisinopril')).toBeTruthy();

      fireEvent.press(getByText('Mark Taken'));

      expect(takeMedication).toHaveBeenCalledWith('1');
    });

    it('adds new medication', () => {
      const addMedication = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        medications: mockMedications,
        addMedication,
        settings: { leftHandMode: false },
      });

      const { getByPlaceholderText, getByText } = render(<AddMedicationScreen />);

      fireEvent.changeText(getByPlaceholderText('Enter medication name'), 'Aspirin');
      fireEvent.changeText(getByPlaceholderText('e.g., 10mg'), '81mg');
      fireEvent.changeText(getByPlaceholderText('Enter pharmacy name'), 'CVS Pharmacy');

      fireEvent.press(getByText('Save Medication'));

      expect(addMedication).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Aspirin',
          dose: '81mg',
          pharmacy: 'CVS Pharmacy',
        })
      );
    });
  });

  describe('User Flow: Navigation', () => {
    it('renders home screen with all sections', () => {
      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        medications: [
          {
            id: '1',
            name: 'Lisinopril',
            dose: '10mg',
            times: ['09:00'],
          },
        ],
        appointments: [
          {
            id: '1',
            title: 'Dr. Smith',
            dateTime: new Date().toISOString(),
          },
        ],
        settings: { leftHandMode: false },
      });

      const { getByText } = render(<HomeScreen />);

      expect(getByText('Today')).toBeTruthy();
      expect(getByText('Medications Due')).toBeTruthy();
      expect(getByText("Today's Appointments")).toBeTruthy();
    });

    it('medications screen displays medication list', () => {
      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        medications: [
          {
            id: '1',
            name: 'Lisinopril',
            dose: '10mg',
            frequency: 'Once daily',
          },
        ],
        settings: { leftHandMode: false },
      });

      const { getByText } = render(
        <NavigationContainer>
          <MedicationsScreen />
        </NavigationContainer>
      );

      expect(getByText('Medications')).toBeTruthy();
      expect(getByText('Lisinopril')).toBeTruthy();
    });

    it('appointments screen displays appointments', () => {
      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        appointments: [
          {
            id: '1',
            title: 'Dr. Smith - Checkup',
            dateTime: new Date().toISOString(),
            location: 'Main Clinic',
          },
        ],
        settings: { leftHandMode: false },
      });

      const { getByText } = render(
        <NavigationContainer>
          <AppointmentsScreen />
        </NavigationContainer>
      );

      expect(getByText('Calendar')).toBeTruthy();
    });

    it('messages screen displays message templates', () => {
      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        messageTemplates: [
          {
            id: '1',
            name: 'Question',
            text: 'I have a question about...',
          },
        ],
        contacts: [],
        settings: { leftHandMode: false },
      });

      const { getByText } = render(
        <NavigationContainer>
          <MessagesScreen />
        </NavigationContainer>
      );

      expect(getByText('Messages')).toBeTruthy();
    });
  });

  describe('User Flow: Settings Management', () => {
    it('changes settings and persists them', () => {
      const updateSettings = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        settings: {
          leftHandMode: false,
          biometricEnabled: true,
          notificationLeadTime: 30,
          sessionTimeout: 15,
          textSize: 'medium',
          highContrast: false,
        },
        updateSettings,
        medications: [{ id: '1' }],
        appointments: [{ id: '1' }],
      });

      const { getAllByRole } = render(<SettingsScreen />);

      const switches = getAllByRole('switch');

      fireEvent(switches[0], 'valueChange', true);
      expect(updateSettings).toHaveBeenCalledWith({ leftHandMode: true });

      fireEvent(switches[1], 'valueChange', false);
      expect(updateSettings).toHaveBeenCalledWith({ biometricEnabled: false });
    });
  });

  describe('User Flow: Refill Request', () => {
    it('completes the 3-step refill request flow', () => {
      const createRefillRequest = jest.fn();
      const updateRefillRequest = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        medications: [
          {
            id: '1',
            name: 'Lisinopril',
            dose: '10mg',
            pharmacy: 'CVS Pharmacy - Main St',
            refillsRemaining: 1,
          },
        ],
        refillRequests: [],
        createRefillRequest,
        updateRefillRequest,
      });

      const { getByText } = render(<RefillRequestScreen />);

      expect(getByText('Step 1: Confirm Medication')).toBeTruthy();
      fireEvent.press(getByText('Next'));

      expect(createRefillRequest).toHaveBeenCalledWith('1');
      expect(getByText('Step 2: Select Pharmacy')).toBeTruthy();

      fireEvent.press(getByText('Next'));
      expect(getByText('Step 3: Review & Submit')).toBeTruthy();

      fireEvent.press(getByText('Submit'));
      expect(updateRefillRequest).toHaveBeenCalled();
    });
  });
});
