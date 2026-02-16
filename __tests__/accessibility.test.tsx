import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { LoginScreen } from '../src/screens/LoginScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { AppNavigator } from '../src/navigation/AppNavigator';
import { ACCESSIBILITY, COLORS } from '../src/utils/constants';
import { useApp } from '../src/context/AppContext';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      Screen: ({ options }: { options?: { title?: string } }) => (
        <Text>{options?.title ?? ''}</Text>
      ),
    }),
  };
});

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
      Screen: ({ component: Component, name, options }: any) => (
        <>
          <Text>{options?.title ?? name}</Text>
          {name === 'MainTabs' && Component ? <Component /> : null}
        </>
      ),
    }),
  };
});

jest.mock('../src/context/AppContext', () => ({
  useApp: jest.fn(),
}));

const baseAppState = {
  isAuthenticated: true,
  hasCompletedOnboarding: true,
  settings: {
    leftHandMode: false,
    biometricEnabled: true,
    notificationLeadTime: 30,
    sessionTimeout: 15,
    textSize: 'medium',
    highContrast: false,
  },
  login: jest.fn(),
  logout: jest.fn(),
  updateSettings: jest.fn(),
  medications: [],
  addMedication: jest.fn(),
  updateMedication: jest.fn(),
  deleteMedication: jest.fn(),
  takeMedication: jest.fn(),
  skipMedication: jest.fn(),
  undoLastMedicationAction: jest.fn(),
  appointments: [],
  addAppointment: jest.fn(),
  updateAppointment: jest.fn(),
  deleteAppointment: jest.fn(),
  refillRequests: [],
  createRefillRequest: jest.fn(),
  updateRefillRequest: jest.fn(),
  wellnessEntries: [],
  addWellnessEntry: jest.fn(),
  messageTemplates: [],
  contacts: [],
  favorites: [],
  toggleFavorite: jest.fn(),
  completeOnboarding: jest.fn(),
};

describe('Accessibility Tests', () => {
  beforeEach(() => {
    (useApp as jest.Mock).mockReturnValue({ ...baseAppState });
  });

  describe('Touch Target Size', () => {
    it('buttons meet minimum touch target size', () => {
      const { getByRole } = render(<Button title="Sign In" onPress={jest.fn()} />);
      const button = getByRole('button');
      const style = StyleSheet.flatten(button.props.style);

      expect(style.minHeight).toBeGreaterThanOrEqual(ACCESSIBILITY.MIN_TOUCH_SIZE);
    });

    it('text inputs meet minimum touch target size', () => {
      const { getByPlaceholderText } = render(
        <Input label="Username" placeholder="Enter username" />
      );

      const input = getByPlaceholderText('Enter username');
      const style = StyleSheet.flatten(input.props.style);

      expect(style.minHeight).toBeGreaterThanOrEqual(ACCESSIBILITY.MIN_TOUCH_SIZE);
    });

    it('tab bar renders all main items', () => {
      const { getByText } = render(
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      );

      expect(getByText('Today')).toBeTruthy();
      expect(getByText('Medications')).toBeTruthy();
      expect(getByText('Calendar')).toBeTruthy();
      expect(getByText('Messages')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });
  });

  describe('Semantic Labels', () => {
    it('important buttons have accessibility labels', () => {
      const { getByLabelText } = render(<LoginScreen />);

      expect(getByLabelText('Sign In')).toBeTruthy();
      expect(getByLabelText('Use Passcode')).toBeTruthy();
    });

    it('form fields have labels', () => {
      const { getByText } = render(<LoginScreen />);

      expect(getByText('Username')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
    });
  });

  describe('Left-Hand Mode', () => {
    it('left-hand mode can be enabled during onboarding', () => {
      const updateSettings = jest.fn();
      const completeOnboarding = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        ...baseAppState,
        settings: { ...baseAppState.settings, leftHandMode: false },
        updateSettings,
        completeOnboarding,
      });

      const { getByTestId } = render(<OnboardingScreen />);

      fireEvent.press(getByTestId('left-hand-button'));
      fireEvent.press(getByTestId('continue-button'));

      expect(updateSettings).toHaveBeenCalledWith({ leftHandMode: true });
      expect(completeOnboarding).toHaveBeenCalled();
    });

    it('left-hand mode can be toggled in settings', () => {
      const updateSettings = jest.fn();

      (useApp as jest.Mock).mockReturnValue({
        ...baseAppState,
        settings: { ...baseAppState.settings, leftHandMode: false },
        updateSettings,
        medications: [{ id: '1' }],
        appointments: [{ id: '1' }],
      });

      const { getAllByRole } = render(<SettingsScreen />);

      const switches = getAllByRole('switch');
      fireEvent(switches[0], 'valueChange', true);

      expect(updateSettings).toHaveBeenCalledWith({ leftHandMode: true });
    });
  });

  describe('Color Contrast', () => {
    const luminance = (hex: string) => {
      const rgb = hex.replace('#', '').match(/.{2}/g)!.map((x) => parseInt(x, 16) / 255);
      const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const contrastRatio = (c1: string, c2: string) => {
      const l1 = luminance(c1);
      const l2 = luminance(c2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    };

    it('primary color has sufficient contrast on white', () => {
      expect(contrastRatio(COLORS.primary, COLORS.surface)).toBeGreaterThanOrEqual(3.0);
    });

    it('error color has sufficient contrast on white', () => {
      expect(contrastRatio(COLORS.error, COLORS.surface)).toBeGreaterThanOrEqual(3.0);
    });

    it('secondary text has sufficient contrast on white', () => {
      expect(contrastRatio(COLORS.textSecondary, COLORS.surface)).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Keyboard Navigation', () => {
    it('text inputs are editable', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);

      const username = getByPlaceholderText('Enter your username');
      const password = getByPlaceholderText('Enter your password');

      expect(username.props.editable).not.toBe(false);
      expect(password.props.editable).not.toBe(false);
    });
  });
});
