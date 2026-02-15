// AppointmentDetailScreen.tsx - Stub
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/constants';
import { formatDate, formatTime } from '../utils/helpers';

export const AppointmentDetailScreen: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { appointments } = useApp();
  const appointment = appointments.find(a => a.id === id);

  if (!appointment) return <SafeAreaView><Text>Not found</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.title}>{appointment.title}</Text>
          <Text style={styles.detail}>{formatDate(appointment.date)} at {formatTime(appointment.time)}</Text>
          <Text style={styles.detail}>{appointment.location}</Text>
          <Text style={styles.detail}>{appointment.provider}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  title: { fontSize: TYPOGRAPHY.sizes.xxlarge, fontWeight: TYPOGRAPHY.weights.bold },
  detail: { fontSize: TYPOGRAPHY.sizes.large, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
