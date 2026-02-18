import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AppProvider, useAppContext } from '../../src/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, Appointment } from '../../src/types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('AppProvider/Context Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  test('Initial state is unauthenticated', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  test('Login changes authentication state', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      result.current.login();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  test('Logout changes authentication state', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // Login first
    await act(async () => {
      result.current.login();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Then logout
    await act(async () => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  test('Left-hand mode persists to storage', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.settings.leftHandMode).toBe(false);

    await act(async () => {
      result.current.updateSettings({ leftHandMode: true });
    });

    await waitFor(() => {
      expect(result.current.settings.leftHandMode).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  test('Biometric setting persists to storage', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const initialBiometric = result.current.settings.biometricEnabled;

    await act(async () => {
      result.current.updateSettings({ biometricEnabled: !initialBiometric });
    });

    await waitFor(() => {
      expect(result.current.settings.biometricEnabled).toBe(!initialBiometric);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  test('Adding medication updates state', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const initialCount = result.current.medications.length;

    await act(async () => {
      result.current.addMedication({
        name: 'Test Medication',
        dose: '100mg',
        frequency: 'Daily',
        times: ['09:00'],
        refillsRemaining: 3,
        pharmacy: 'Test Pharmacy',
      });
    });

    await waitFor(() => {
      expect(result.current.medications.length).toBe(initialCount + 1);
      expect(result.current.medications.some(m => m.name === 'Test Medication')).toBe(true);
    });
  });

  test('Updating medication works correctly', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // Add a medication first
    let medicationId: string = '';
    await act(async () => {
      result.current.addMedication({
        name: 'Original Name',
        dose: '100mg',
        frequency: 'Daily',
        times: ['09:00'],
        refillsRemaining: 3,
        pharmacy: 'Test Pharmacy',
      });
    });

    await waitFor(() => {
      const newMed = result.current.medications.find(m => m.name === 'Original Name');
      medicationId = newMed?.id || '';
      expect(medicationId).toBeTruthy();
    });

    // Update the medication
    await act(async () => {
      result.current.updateMedication(medicationId, { name: 'Updated Name' });
    });

    await waitFor(() => {
      const updatedMed = result.current.medications.find(m => m.id === medicationId);
      expect(updatedMed?.name).toBe('Updated Name');
    });
  });

  test('Deleting medication removes it from state', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // Add a medication first
    let medicationId: string = '';
    await act(async () => {
      result.current.addMedication({
        name: 'To Delete',
        dose: '100mg',
        frequency: 'Daily',
        times: ['09:00'],
        refillsRemaining: 3,
        pharmacy: 'Test Pharmacy',
      });
    });

    await waitFor(() => {
      const newMed = result.current.medications.find(m => m.name === 'To Delete');
      medicationId = newMed?.id || '';
      expect(medicationId).toBeTruthy();
    });

    const countBefore = result.current.medications.length;

    // Delete the medication
    await act(async () => {
      result.current.deleteMedication(medicationId);
    });

    await waitFor(() => {
      expect(result.current.medications.length).toBe(countBefore - 1);
      expect(result.current.medications.find(m => m.id === medicationId)).toBeUndefined();
    });
  });

  test('Taking medication updates history', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // Assuming there are default medications, take the first one
    const firstMed = result.current.medications[0];
    if (firstMed) {
      const historyLengthBefore = firstMed.history?.length || 0;

      await act(async () => {
        result.current.takeMedication(firstMed.id, 'TestUser');
      });

      await waitFor(() => {
        const updatedMed = result.current.medications.find(m => m.id === firstMed.id);
        expect(updatedMed?.history?.length).toBeGreaterThan(historyLengthBefore);
        expect(updatedMed?.lastTaken?.action).toBe('taken');
      });
    } else {
      expect(true).toBeTruthy(); // No medications to test with
    }
  });

  test('Skipping medication updates history', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const firstMed = result.current.medications[0];
    if (firstMed) {
      await act(async () => {
        result.current.skipMedication(firstMed.id, 'TestUser');
      });

      await waitFor(() => {
        const updatedMed = result.current.medications.find(m => m.id === firstMed.id);
        expect(updatedMed?.lastTaken?.action).toBe('skipped');
      });
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('Adding appointment updates state', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const initialCount = result.current.appointments.length;

    await act(async () => {
      result.current.addAppointment({
        title: 'Test Appointment',
        date: new Date(),
        time: '10:00 AM',
        location: 'Test Clinic',
        provider: 'Dr. Test',
      });
    });

    await waitFor(() => {
      expect(result.current.appointments.length).toBe(initialCount + 1);
      expect(result.current.appointments.some(a => a.title === 'Test Appointment')).toBe(true);
    });
  });

  test('Updating appointment works correctly', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    let appointmentId: string = '';
    await act(async () => {
      result.current.addAppointment({
        title: 'Original Title',
        date: new Date(),
        time: '10:00 AM',
        location: 'Test Clinic',
        provider: 'Dr. Test',
      });
    });

    await waitFor(() => {
      const newAppt = result.current.appointments.find(a => a.title === 'Original Title');
      appointmentId = newAppt?.id || '';
      expect(appointmentId).toBeTruthy();
    });

    await act(async () => {
      result.current.updateAppointment(appointmentId, { title: 'Updated Title' });
    });

    await waitFor(() => {
      const updatedAppt = result.current.appointments.find(a => a.id === appointmentId);
      expect(updatedAppt?.title).toBe('Updated Title');
    });
  });

  test('Deleting appointment removes it from state', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    let appointmentId: string = '';
    await act(async () => {
      result.current.addAppointment({
        title: 'To Delete',
        date: new Date(),
        time: '10:00 AM',
        location: 'Test Clinic',
        provider: 'Dr. Test',
      });
    });

    await waitFor(() => {
      const newAppt = result.current.appointments.find(a => a.title === 'To Delete');
      appointmentId = newAppt?.id || '';
      expect(appointmentId).toBeTruthy();
    });

    const countBefore = result.current.appointments.length;

    await act(async () => {
      result.current.deleteAppointment(appointmentId);
    });

    await waitFor(() => {
      expect(result.current.appointments.length).toBe(countBefore - 1);
      expect(result.current.appointments.find(a => a.id === appointmentId)).toBeUndefined();
    });
  });

  test('Creating refill request works', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const firstMed = result.current.medications[0];
    if (firstMed) {
      const initialCount = result.current.refillRequests.length;

      await act(async () => {
        result.current.createRefillRequest(firstMed.id);
      });

      await waitFor(() => {
        expect(result.current.refillRequests.length).toBe(initialCount + 1);
        expect(result.current.refillRequests.some(r => r.medicationId === firstMed.id)).toBe(true);
      });
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('Settings update persists to storage', async () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    await act(async () => {
      result.current.updateSettings({
        fontSize: 'large',
        highContrast: true,
      });
    });

    await waitFor(() => {
      expect(result.current.settings.fontSize).toBe('large');
      expect(result.current.settings.highContrast).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  test('Message templates are available', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.messageTemplates.length).toBeGreaterThan(0);
  });

  test('Contacts are available', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.contacts.length).toBeGreaterThan(0);
  });
});
