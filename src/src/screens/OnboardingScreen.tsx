import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, ACCESSIBILITY } from '../utils/constants';

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding, updateSettings, settings } = useApp();
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>(
    settings.leftHandMode ? 'left' : 'right'
  );

  const handleContinue = () => {
    updateSettings({ leftHandMode: selectedHand === 'left' });
    completeOnboarding();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>CC</Text>
            </View>
          </View>

          {/* Welcome Text */}
          <Text style={styles.title}>Welcome to CareConnect</Text>
          <Text style={styles.subtitle}>Let's personalize your experience</Text>

          {/* Hand Preference Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hand Preference</Text>
            <Text style={styles.sectionDescription}>
              Choose your preferred hand for easier one-handed use. This moves buttons and controls
              to your thumb zone.
            </Text>

            <View style={styles.handOptions}>
              <TouchableOpacity
                style={[
                  styles.handOption,
                  selectedHand === 'right' && styles.handOptionSelected,
                ]}
                onPress={() => setSelectedHand('right')}
                accessibilityLabel="Right hand mode"
                accessibilityRole="button"
                testID="right-hand-button"
              >
                <Text style={styles.handEmoji}>🤚</Text>
                <Text style={styles.handLabel}>Right Hand</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.handOption,
                  selectedHand === 'left' && styles.handOptionSelected,
                ]}
                onPress={() => setSelectedHand('left')}
                accessibilityLabel="Left hand mode"
                accessibilityRole="button"
                testID="left-hand-button"
              >
                <Text style={styles.handEmoji}>🖐️</Text>
                <Text style={styles.handLabel}>Left Hand</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Accessibility Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibility Features</Text>
            <View style={styles.featureList}>
              <FeatureItem text="56×56dp minimum touch targets" />
              <FeatureItem text="8dp spacing for comfortable tapping" />
              <FeatureItem text="Configurable text-to-speech support" />
              <FeatureItem text="High contrast mode available" />
              <FeatureItem text="Haptic feedback for important actions" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View
        style={[
          styles.footer,
          selectedHand === 'left' ? styles.footerLeft : styles.footerRight,
        ]}
      >
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          size="large"
          testID="continue-button"
        />
      </View>
    </SafeAreaView>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureDot} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  content: {
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: TYPOGRAPHY.sizes.xxxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.large,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.xlarge,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  handOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  handOption: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: ACCESSIBILITY.BORDER_RADIUS,
    padding: SPACING.md,
    alignItems: 'center',
    minHeight: ACCESSIBILITY.MIN_TOUCH_SIZE * 1.5,
    justifyContent: 'center',
  },
  handOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  handEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  handLabel: {
    fontSize: TYPOGRAPHY.sizes.medium,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
  },
  featureList: {
    gap: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  featureText: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerLeft: {
    alignItems: 'flex-start',
  },
  footerRight: {
    alignItems: 'flex-end',
  },
});
