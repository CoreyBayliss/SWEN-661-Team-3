import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, ACCESSIBILITY, TYPOGRAPHY } from '../utils/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  testID,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          textInputProps.multiline && styles.inputMultiline,
        ]}
        placeholderTextColor={COLORS.textSecondary}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.medium,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    minHeight: ACCESSIBILITY.MIN_TOUCH_SIZE,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: ACCESSIBILITY.BORDER_RADIUS,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.large,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
