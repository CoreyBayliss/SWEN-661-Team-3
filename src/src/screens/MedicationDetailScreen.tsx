// MedicationDetailScreen.tsx - Stub implementation
// TODO: Implement full medication detail view with history and actions

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';

export const MedicationDetailScreen: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { medications, takeMedication, skipMedication, undoLastMedicationAction } = useApp();
  
  const medication = medications.find(m => m.id === id);
  
  if (!medication) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Medication not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.dose}>{medication.dose}</Text>
          <Text style={styles.frequency}>{medication.frequency}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>History</Text>
          {medication.history.length === 0 ? (
            <Text style={styles.emptyText}>No history yet</Text>
          ) : (
            medication.history.reverse().map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyAction}>{entry.action}</Text>
                <Text style={styles.historyTime}>{formatDateTime(entry.timestamp)}</Text>
              </View>
            ))
          )}
        </Card>

        <View style={styles.actions}>
          <Button title="Take Now" onPress={() => takeMedication(id, 'User')} fullWidth />
          <Button title="Skip" onPress={() => skipMedication(id, 'User')} variant="secondary" fullWidth />
          {medication.history.length > 0 && (
            <Button title="Undo Last" onPress={() => undoLastMedicationAction(id)} variant="ghost" fullWidth />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  name: { fontSize: TYPOGRAPHY.sizes.xxlarge, fontWeight: TYPOGRAPHY.weights.bold, color: COLORS.text },
  dose: { fontSize: TYPOGRAPHY.sizes.large, color: COLORS.textSecondary, marginTop: SPACING.xs },
  frequency: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.textSecondary, marginTop: SPACING.xs },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.large, fontWeight: TYPOGRAPHY.weights.semibold, marginBottom: SPACING.md },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  historyAction: { fontSize: TYPOGRAPHY.sizes.medium, textTransform: 'capitalize' },
  historyTime: { fontSize: TYPOGRAPHY.sizes.small, color: COLORS.textSecondary },
  emptyText: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SPACING.lg },
  actions: { gap: SPACING.md },
});
