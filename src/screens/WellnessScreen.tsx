// WellnessScreen.tsx - Stub
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, ACCESSIBILITY } from '../utils/constants';

type Mood = 'great' | 'good' | 'okay' | 'bad' | 'terrible';
type Energy = 'high' | 'medium' | 'low';
type Pain = 'none' | 'mild' | 'moderate' | 'severe';

export const WellnessScreen: React.FC = () => {
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [pain, setPain] = useState<Pain | null>(null);
  const [notes, setNotes] = useState('');
  
  const { addWellnessEntry, wellnessEntries } = useApp();

  const handleSave = () => {
    if (!mood || !energy || !pain) {
      Alert.alert('Error', 'Please select mood, energy, and pain level');
      return;
    }

    addWellnessEntry({ date: new Date().toISOString(), mood, energy, pain, notes });
    setMood(null);
    setEnergy(null);
    setPain(null);
    setNotes('');
    Alert.alert('Success', 'Wellness entry saved!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          
          <Text style={styles.label}>Mood:</Text>
          <View style={styles.chipRow}>
            <Chip label="😄" selected={mood === 'great'} onPress={() => setMood('great')} />
            <Chip label="🙂" selected={mood === 'good'} onPress={() => setMood('good')} />
            <Chip label="😐" selected={mood === 'okay'} onPress={() => setMood('okay')} />
            <Chip label="☹️" selected={mood === 'bad'} onPress={() => setMood('bad')} />
            <Chip label="😢" selected={mood === 'terrible'} onPress={() => setMood('terrible')} />
          </View>

          <Text style={styles.label}>Energy:</Text>
          <View style={styles.chipRow}>
            <Chip label="⚡ High" selected={energy === 'high'} onPress={() => setEnergy('high')} />
            <Chip label="➡️ Med" selected={energy === 'medium'} onPress={() => setEnergy('medium')} />
            <Chip label="🔋 Low" selected={energy === 'low'} onPress={() => setEnergy('low')} />
          </View>

          <Text style={styles.label}>Pain:</Text>
          <View style={styles.chipRow}>
            <Chip label="None" selected={pain === 'none'} onPress={() => setPain('none')} />
            <Chip label="Mild" selected={pain === 'mild'} onPress={() => setPain('mild')} />
            <Chip label="Moderate" selected={pain === 'moderate'} onPress={() => setPain('moderate')} />
            <Chip label="Severe" selected={pain === 'severe'} onPress={() => setPain('severe')} />
          </View>

          <Input label="Notes (Optional)" value={notes} onChangeText={setNotes} multiline />
          <Button title="Save Entry" onPress={handleSave} fullWidth />
        </Card>

        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {wellnessEntries.slice(0, 5).map(entry => (
          <Card key={entry.id}>
            <Text>Mood: {entry.mood} | Energy: {entry.energy} | Pain: {entry.pain}</Text>
            {entry.notes && <Text style={styles.notes}>{entry.notes}</Text>}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Chip: React.FC<{ label: string; selected: boolean; onPress: () => void }> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.xlarge, fontWeight: TYPOGRAPHY.weights.semibold, marginVertical: SPACING.md },
  label: { fontSize: TYPOGRAPHY.sizes.medium, fontWeight: TYPOGRAPHY.weights.medium, marginTop: SPACING.md, marginBottom: SPACING.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  chip: { minWidth: ACCESSIBILITY.MIN_TOUCH_SIZE, minHeight: ACCESSIBILITY.MIN_TOUCH_SIZE, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: ACCESSIBILITY.BORDER_RADIUS, backgroundColor: COLORS.surface, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.text },
  chipTextSelected: { color: COLORS.surface },
  notes: { fontSize: TYPOGRAPHY.sizes.small, color: COLORS.textSecondary, marginTop: SPACING.sm },
});
