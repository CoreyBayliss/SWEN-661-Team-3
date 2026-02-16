import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RefillRequestScreen } from '../src/screens/RefillRequestScreen';
import { useApp } from '../src/context/AppContext';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { medicationId: '1' } }),
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.mock('../src/context/AppContext', () => ({
  useApp: jest.fn(),
}));

describe('Integration: Refill Request Flow', () => {
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
        },
      ],
      refillRequests: [],
      createRefillRequest,
      updateRefillRequest,
    });

    const { getByText, queryByText } = render(<RefillRequestScreen />);

    expect(getByText('Step 1: Confirm Medication')).toBeTruthy();
    fireEvent.press(getByText('Next'));

    expect(createRefillRequest).toHaveBeenCalledWith('1');
    expect(getByText('Step 2: Select Pharmacy')).toBeTruthy();

    fireEvent.press(getByText('Next'));
    expect(getByText('Step 3: Review & Submit')).toBeTruthy();

    fireEvent.press(getByText('Submit'));

    expect(queryByText('Step 3: Review & Submit')).toBeTruthy();
  });
});
