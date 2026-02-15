// AppointmentsScreen.tsx - Stub implementation
// TODO: Add calendar view, filtering, and full appointment list

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { COLORS, SPACING, TYPOGRAPHY, ROUTES } from '../utils/constants';
import { formatDate, formatTime } from '../utils/helpers';
import { Appointment } from '../types';

export const AppointmentsScreen: React.FC = () => {
  const navigation = useNavigation() as any;
  const { appointments } = useApp();

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <Card onPress={() => navigation.navigate(ROUTES.APPOINTMENT_DETAIL , { id: item.id })}>
      <View style={styles.appointmentCard}>
        <View style={styles.iconContainer}>
          <Icon name="calendar" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.details}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <Icon name="chevron-forward" size={24} color={COLORS.textSecondary} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.ADD_APPOINTMENT)}>
          <Icon name="add-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.xxxlarge, fontWeight: TYPOGRAPHY.weights.bold },
  list: { padding: SPACING.lg },
  appointmentCard: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.primaryLight + '20', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  appointmentInfo: { flex: 1 },
  title: { fontSize: TYPOGRAPHY.sizes.large, fontWeight: TYPOGRAPHY.weights.semibold, marginBottom: SPACING.xs },
  details: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.textSecondary },
  location: { fontSize: TYPOGRAPHY.sizes.small, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
