// Accessibility constants
export const ACCESSIBILITY = {
  MIN_TOUCH_SIZE: 56, // 56x56dp minimum touch target
  SPACING: 8, // 8dp spacing between elements
  BORDER_RADIUS: 12,
  ANIMATION_DURATION: 300,
};

// Colors
export const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  disabled: '#cbd5e1',
};

// Typography
export const TYPOGRAPHY = {
  sizes: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 24,
    xxxlarge: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Navigation routes
export const ROUTES = {
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  HOME: 'Home',
  MEDICATIONS: 'Medications',
  MEDICATION_DETAIL: 'MedicationDetail',
  ADD_MEDICATION: 'AddMedication',
  APPOINTMENTS: 'Appointments',
  APPOINTMENT_DETAIL: 'AppointmentDetail',
  ADD_APPOINTMENT: 'AddAppointment',
  MESSAGES: 'Messages',
  WELLNESS: 'Wellness',
  SETTINGS: 'Settings',
  REFILL_REQUEST: 'RefillRequest',
};

// Time formats
export const TIME_FORMATS = {
  DISPLAY: 'h:mm a',
  DISPLAY_DATE: 'MMM d, yyyy',
  DISPLAY_DATE_TIME: 'MMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};
