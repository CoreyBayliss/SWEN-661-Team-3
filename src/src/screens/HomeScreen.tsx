import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, ROUTES } from '../utils/constants';
import { getDueMedications, getUpcomingAppointments, formatTime, formatDate } from '../utils/helpers';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation() as any;
  const { medications, appointments, takeMedication, settings } = useApp();
  const dueMedications = getDueMedications(medications);
  const upcomingAppointments = getUpcomingAppointments(appointments);

  const handleTakeMedication = (medicationId: string) => {
    ReactNativeHapticFeedback.trigger('notificationSuccess');
    takeMedication(medicationId, 'Current User');
  };

  return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good {getGreeting()}</Text>
              <Text style={styles.date}>{formatDate(new Date().toISOString())}</Text>
            </View>
            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate(ROUTES.SETTINGS)}
                accessibilityLabel="Profile"
            >
              <Icon name="person-circle-outline" size={40} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <QuickActionButton
                  icon="medical"
                  label="Add Medication"
                  onPress={() => navigation.navigate(ROUTES.ADD_MEDICATION)}
              />
              <QuickActionButton
                  icon="calendar"
                  label="New Appointment"
                  onPress={() => navigation.navigate(ROUTES.ADD_APPOINTMENT)}
              />
              <QuickActionButton
                  icon="heart"
                  label="Log Wellness"
                  onPress={() => navigation.navigate(ROUTES.WELLNESS)}
              />
              <QuickActionButton
                  icon="chatbubbles"
                  label="Messages"
                  onPress={() => navigation.navigate(ROUTES.MESSAGES)}
              />
            </View>
          </View>

          {/* Due Medications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Due Medications</Text>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MEDICATIONS)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {dueMedications.length === 0 ? (
                <Card>
                  <View style={styles.emptyState}>
                    <Icon name="checkmark-circle-outline" size={48} color={COLORS.success} />
                    <Text style={styles.emptyStateText}>All caught up!</Text>
                    <Text style={styles.emptyStateSubtext}>No medications due right now</Text>
                  </View>
                </Card>
            ) : (
                dueMedications.map((medication) => (
                    <Card key={medication.id}>
                      <View style={styles.medicationCard}>
                        <View style={styles.medicationInfo}>
                          <Text style={styles.medicationName}>{medication.name}</Text>
                          <Text style={styles.medicationDose}>{medication.dose}</Text>
                          <Text style={styles.medicationTime}>
                            Due: {formatTime(medication.times[0])}
                          </Text>
                        </View>
                        <Button
                            title="Take Now"
                            onPress={() => handleTakeMedication(medication.id)}
                            variant="primary"
                            size="small"
                            testID={`take-medication-${medication.id}`}
                        />
                      </View>
                    </Card>
                ))
            )}
          </View>

          {/* Upcoming Appointments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.APPOINTMENTS)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {upcomingAppointments.length === 0 ? (
                <Card>
                  <View style={styles.emptyState}>
                    <Icon name="calendar-outline" size={48} color={COLORS.textSecondary} />
                    <Text style={styles.emptyStateText}>No upcoming appointments</Text>
                  </View>
                </Card>
            ) : (
                upcomingAppointments.map((appointment) => (
                    <Card
                        key={appointment.id}
                        onPress={() => navigation.navigate(ROUTES.APPOINTMENT_DETAIL, { id: appointment.id })}
                    >
                      <View style={styles.appointmentCard}>
                        <View style={styles.appointmentIconContainer}>
                          <Icon name="calendar" size={24} color={COLORS.primary} />
                        </View>
                        <View style={styles.appointmentInfo}>
                          <Text style={styles.appointmentTitle}>{appointment.title}</Text>
                          <Text style={styles.appointmentDetails}>
                            {formatDate(appointment.date)} at {formatTime(appointment.time)}
                          </Text>
                          <Text style={styles.appointmentLocation}>{appointment.location}</Text>
                        </View>
                        <Icon name="chevron-forward" size={24} color={COLORS.textSecondary} />
                      </View>
                    </Card>
                ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const QuickActionButton: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress} accessibilityLabel={label}>
    <View style={styles.quickActionIcon}>
      <Icon name={icon} size={24} color={COLORS.primary} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.xxxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
  },
  date: {
    fontSize: TYPOGRAPHY.sizes.large,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.xlarge,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontSize: TYPOGRAPHY.sizes.small,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  medicationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  medicationDose: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
  },
  medicationTime: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.warning,
    marginTop: SPACING.xs,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: TYPOGRAPHY.sizes.large,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  appointmentDetails: {
    fontSize: TYPOGRAPHY.sizes.medium,
    color: COLORS.textSecondary,
  },
  appointmentLocation: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
