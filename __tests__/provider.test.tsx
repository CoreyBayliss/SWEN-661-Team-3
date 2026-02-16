import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppProvider, useApp } from '../src/context/AppContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppProvider (translated)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login and logout toggle authentication state', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => result.current.login());
    expect(result.current.isAuthenticated).toBe(true);

    act(() => result.current.logout());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('persists left-hand mode setting', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => result.current.updateSettings({ leftHandMode: true }));

    expect(result.current.settings.leftHandMode).toBe(true);
  });

  it('tracks onboarding completion', () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => result.current.completeOnboarding());

    expect(result.current.hasCompletedOnboarding).toBe(true);
  });
});
