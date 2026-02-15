// AddMedicationScreen.tsx - Stub implementation
// TODO: Add time pickers, validation, and full form

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../utils/constants';

export const AddMedicationScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [pharmacy, setPharmacy] = useState('');
  const [refills, setRefills] = useState('');
  
  const { addMedication } = useApp();
  const navigation = useNavigation();

  const handleSave = () => {
    if (!name || !dose) {
      Alert.alert('Error', 'Please enter medication name and dose');
      return;
    }

    addMedication({
      name,
      dose,
      frequency,
      times: ['09:00'], // TODO: Add time picker
      refillsRemaining: parseInt(refills) || 0,
      pharmacy,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Medication Name *" value={name} onChangeText={setName} placeholder="e.g., Aspirin" />
        <Input label="Dose *" value={dose} onChangeText={setDose} placeholder="e.g., 81mg" />
        <Input label="Frequency" value={frequency} onChangeText={setFrequency} />
        <Input label="Pharmacy" value={pharmacy} onChangeText={setPharmacy} />
        <Input label="Refills Remaining" value={refills} onChangeText={setRefills} keyboardType="number-pad" />
        <Button title="Save Medication" onPress={handleSave} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
});
