import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, ROUTES } from '../utils/constants';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, updateSettings, logout, medications, appointments } = useApp();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          // Navigation will automatically redirect to login via AppNavigator
        },
      },
    ]);
  };

  const settingsGroups = [
    {
      title: 'Accessibility',
      items: [
        {
          icon: 'hand-left',
          label: 'Left-Hand Mode',
          description: 'Optimize layout for left-hand use',
          type: 'toggle',
          value: settings.leftHandMode,
          onValueChange: (value: boolean) => updateSettings({ leftHandMode: value }),
        },
        {
          icon: 'text',
          label: 'Text Size',
          description: settings.textSize.charAt(0).toUpperCase() + settings.textSize.slice(1),
          type: 'link',
          onPress: () => {
            // TODO: Navigate to text size picker
          },
        },
        {
          icon: 'contrast',
          label: 'High Contrast',
          description: 'Increase contrast for better visibility',
          type: 'toggle',
          value: settings.highContrast,
          onValueChange: (value: boolean) => updateSettings({ highContrast: value }),
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: 'finger-print',
          label: 'Biometric Authentication',
          description: 'Use Face ID or Touch ID',
          type: 'toggle',
          value: settings.biometricEnabled,
          onValueChange: (value: boolean) => updateSettings({ biometricEnabled: value }),
        },
        {
          icon: 'time',
          label: 'Session Timeout',
          description: `${settings.sessionTimeout} minutes`,
          type: 'link',
          onPress: () => {
            // TODO: Navigate to timeout picker
          },
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications',
          label: 'Medication Reminders',
          description: `${settings.notificationLeadTime} minutes before`,
          type: 'link',
          onPress: () => {
            // TODO: Navigate to notification settings
          },
        },
        {
          icon: 'calendar',
          label: 'Appointment Reminders',
          description: '1 day and 1 hour before',
          type: 'link',
          onPress: () => {
            // TODO: Navigate to appointment notification settings
          },
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* User Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Icon name="person" size={32} color={COLORS.surface} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Current User</Text>
              <Text style={styles.profileEmail}>user@example.com</Text>
            </View>
          </View>
        </Card>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <Card style={styles.settingsCard}>
              {group.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {item.type === 'toggle' ? (
                    <View style={styles.settingRow}>
                      <View style={styles.settingLeft}>
                        <View style={styles.iconContainer}>
                          <Icon name={item.icon} size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.settingText}>
                          <Text style={styles.settingLabel}>{item.label}</Text>
                          <Text style={styles.settingDescription}>{item.description}</Text>
                        </View>
                      </View>
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{ false: COLORS.disabled, true: COLORS.primaryLight }}
                        thumbColor={item.value ? COLORS.primary : COLORS.surface}
                        ios_backgroundColor={COLORS.disabled}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.settingRow} onPress={item.onPress}>
                      <View style={styles.settingLeft}>
                        <View style={styles.iconContainer}>
                          <Icon name={item.icon} size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.settingText}>
                          <Text style={styles.settingLabel}>{item.label}</Text>
                          <Text style={styles.settingDescription}>{item.description}</Text>
                        </View>
                      </View>
                      <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  )}
                  {itemIndex < group.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Data Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Summary</Text>
          <Card>
            <View style={styles.dataGrid}>
              <View style={styles.dataItem}>
                <Text style={styles.dataValue}>{medications.length}</Text>
                <Text style={styles.dataLabel}>Medications</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataValue}>{appointments.length}</Text>
                <Text style={styles.dataLabel}>Appointments</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataValue}>{settings.leftHandMode ? 'Left' : 'Right'}</Text>
                <Text style={styles.dataLabel}>Hand Mode</Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataValue}>✓</Text>
                <Text style={styles.dataLabel}>Synced</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Card style={styles.appInfo}>
            <View style={styles.appLogo}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>CC</Text>
              </View>
            </View>
            <Text style={styles.appName}>CareConnect</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appTagline}>Your health, simplified</Text>
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            size="large"
            fullWidth
            testID="logout-button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
  },
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: TYPOGRAPHY.sizes.xlarge,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  settingsCard: {
    padding: 0,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.md + 40 + SPACING.md,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dataValue: {
    fontSize: TYPOGRAPHY.sizes.xxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  dataLabel: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  appLogo: {
    marginBottom: SPACING.md,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: TYPOGRAPHY.sizes.xxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
  },
  appName: {
    fontSize: TYPOGRAPHY.sizes.xlarge,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  appVersion: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  appTagline: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});
