// RefillRequestScreen.tsx - Stub (3-step workflow)
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/constants';

export const RefillRequestScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { medicationId } = route.params as { medicationId: string };
  const { medications, createRefillRequest, updateRefillRequest, refillRequests } = useApp();
  const [step, setStep] = useState(1);
  
  const medication = medications.find(m => m.id === medicationId);
  const request = refillRequests.find(r => r.medicationId === medicationId);

  if (!medication) return <SafeAreaView><Text>Not found</Text></SafeAreaView>;

  const handleNext = () => {
    if (step === 1 && !request) {
      createRefillRequest(medicationId);
    }
    
    if (step < 3) {
      setStep(step + 1);
      if (request) updateRefillRequest(request.id, { step: (step + 1) as 1 | 2 | 3 });
    } else {
      if (request) updateRefillRequest(request.id, { status: 'processing' });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progress}>
          {[1, 2, 3].map(s => (
            <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
          ))}
        </View>

        {step === 1 && (
          <Card>
            <Text style={styles.stepTitle}>Step 1: Confirm Medication</Text>
            <Text style={styles.medName}>{medication.name}</Text>
            <Text style={styles.medDose}>{medication.dose}</Text>
            <Text style={styles.medPharmacy}>Pharmacy: {medication.pharmacy}</Text>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <Text style={styles.stepTitle}>Step 2: Select Pharmacy</Text>
            <Text>{medication.pharmacy}</Text>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <Text style={styles.stepTitle}>Step 3: Review & Submit</Text>
            <Text>Medication: {medication.name}</Text>
            <Text>Pharmacy: {medication.pharmacy}</Text>
          </Card>
        )}

        <View style={styles.actions}>
          {step > 1 && <Button title="Back" onPress={() => setStep(step - 1)} variant="ghost" fullWidth />}
          <Button title={step === 3 ? 'Submit' : 'Next'} onPress={handleNext} fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.border },
  progressDotActive: { backgroundColor: COLORS.primary },
  stepTitle: { fontSize: TYPOGRAPHY.sizes.xlarge, fontWeight: TYPOGRAPHY.weights.semibold, marginBottom: SPACING.md },
  medName: { fontSize: TYPOGRAPHY.sizes.large, fontWeight: TYPOGRAPHY.weights.medium },
  medDose: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.textSecondary },
  medPharmacy: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.textSecondary, marginTop: SPACING.sm },
  actions: { gap: SPACING.md },
});
