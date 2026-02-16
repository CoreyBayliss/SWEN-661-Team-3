import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../src/components/Button';
import { LoginScreen } from '../src/screens/LoginScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import { ACCESSIBILITY } from '../src/utils/constants';
import { useApp } from '../src/context/AppContext';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn().mockResolvedValue(true),
  isEnrolledAsync: jest.fn().mockResolvedValue(true),
  authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock('../src/context/AppContext', () => ({
  useApp: jest.fn(),
}));

const baseAppState = {
  settings: {
    leftHandMode: false,
    biometricEnabled: true,
    notificationLeadTime: 30,
    sessionTimeout: 15,
    textSize: 'medium',
    highContrast: false,
  },
  login: jest.fn(),
  updateSettings: jest.fn(),
  completeOnboarding: jest.fn(),
};

describe('Widget Tests', () => {
  beforeEach(() => {
    (useApp as jest.Mock).mockReturnValue({ ...baseAppState });
  });

  it('onboarding screen shows when required', () => {
    const { getByText } = render(<OnboardingScreen />);

    expect(getByText('Welcome to CareConnect')).toBeTruthy();
    expect(getByText('Hand Preference')).toBeTruthy();
  });

  it('login screen has required elements', () => {
    const { getByText, getAllByPlaceholderText } = render(<LoginScreen />);

    expect(getByText('CareConnect')).toBeTruthy();
    expect(getByText('Your health, simplified')).toBeTruthy();
    expect(getAllByPlaceholderText(/Enter/)).toHaveLength(2);
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('username and password fields are editable', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Enter your username'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');

    expect(getByDisplayValue('testuser')).toBeTruthy();
    expect(getByDisplayValue('password123')).toBeTruthy();
  });

  it('touch targets meet minimum size', () => {
    const { getByRole } = render(<Button title="Sign In" onPress={jest.fn()} />);
    const button = getByRole('button');
    const style = StyleSheet.flatten(button.props.style);

    expect(style.minHeight).toBeGreaterThanOrEqual(ACCESSIBILITY.MIN_TOUCH_SIZE);
  });
});
