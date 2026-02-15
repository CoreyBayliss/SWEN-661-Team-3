import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render correctly with title', () => {
      const { getByText } = render(<Button title="Test Button" onPress={jest.fn()} />);
      expect(getByText('Test Button')).toBeTruthy();
    });

    it('should render with primary variant by default', () => {
      const { getByText } = render(<Button title="Primary" onPress={jest.fn()} />);
      const button = getByText('Primary').parent;
      expect(button).toBeTruthy();
    });

    it('should render with different variants', () => {
      const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;
      variants.forEach((variant) => {
        const { getByText } = render(
          <Button title={`${variant} Button`} onPress={jest.fn()} variant={variant} />
        );
        expect(getByText(`${variant} Button`)).toBeTruthy();
      });
    });

    it('should render with different sizes', () => {
      const sizes = ['small', 'medium', 'large'] as const;
      sizes.forEach((size) => {
        const { getByText } = render(
          <Button title={`${size} Button`} onPress={jest.fn()} size={size} />
        );
        expect(getByText(`${size} Button`)).toBeTruthy();
      });
    });

    it('should render with testID', () => {
      const { getByTestId } = render(
        <Button title="Test" onPress={jest.fn()} testID="test-button" />
      );
      expect(getByTestId('test-button')).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Press Me" onPress={onPress} />);
      
      fireEvent.press(getByText('Press Me'));
      
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Disabled" onPress={onPress} disabled />);
      
      fireEvent.press(getByText('Disabled'));
      
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByRole } = render(<Button title="Loading" onPress={onPress} loading />);
      
      // Button is rendered but shouldn't fire onPress
      const button = getByRole('button');
      fireEvent.press(button);
      
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show ActivityIndicator when loading', () => {
      const { queryByText, UNSAFE_getByType } = render(
        <Button title="Loading Button" onPress={jest.fn()} loading />
      );
      
      // Title should not be visible
      expect(queryByText('Loading Button')).toBeNull();
      
      // ActivityIndicator should be present
      const { ActivityIndicator } = require('react-native');
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should not show title when loading', () => {
      const { queryByText } = render(
        <Button title="Hidden Title" onPress={jest.fn()} loading />
      );
      
      expect(queryByText('Hidden Title')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      const { getByRole } = render(<Button title="Accessible" onPress={jest.fn()} />);
      
      expect(getByRole('button')).toBeTruthy();
    });

    it('should have accessibility label matching title', () => {
      const { getByLabelText } = render(<Button title="My Button" onPress={jest.fn()} />);
      
      expect(getByLabelText('My Button')).toBeTruthy();
    });

    it('should have disabled accessibility state when disabled', () => {
      const { getByRole } = render(<Button title="Disabled" onPress={jest.fn()} disabled />);
      
      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });

    it('should have disabled accessibility state when loading', () => {
      const { getByRole } = render(<Button title="Loading" onPress={jest.fn()} loading />);
      
      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Full Width', () => {
    it('should render full width when fullWidth prop is true', () => {
      const { getByRole } = render(
        <Button title="Full Width" onPress={jest.fn()} fullWidth />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toMatchObject(
        expect.objectContaining({
          width: '100%',
        })
      );
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom styles', () => {
      const customStyle = { marginTop: 20 };
      const { getByRole } = render(
        <Button title="Custom Style" onPress={jest.fn()} style={customStyle} />
      );
      
      const button = getByRole('button');
      expect(button.props.style).toMatchObject(expect.objectContaining(customStyle));
    });
  });
});
