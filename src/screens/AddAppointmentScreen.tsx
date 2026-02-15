// AddAppointmentScreen.tsx - Stub
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../utils/constants';

export const AddAppointmentScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [provider, setProvider] = useState('');
  
  const { addAppointment } = useApp();
  const navigation = useNavigation();

  const handleSave = () => {
    if (!title || !date || !time) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    addAppointment({ title, date, time, location, provider });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Input label="Title *" value={title} onChangeText={setTitle} />
        <Input label="Date *" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
        <Input label="Time *" value={time} onChangeText={setTime} placeholder="HH:MM" />
        <Input label="Location" value={location} onChangeText={setLocation} />
        <Input label="Provider" value={provider} onChangeText={setProvider} />
        <Button title="Save Appointment" onPress={handleSave} fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
});
