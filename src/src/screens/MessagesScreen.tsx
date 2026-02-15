// MessagesScreen.tsx - Stub
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/constants';

export const MessagesScreen: React.FC = () => {
  const { messageTemplates, contacts } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Quick Messages</Text>
        {messageTemplates.map(template => (
          <Card key={template.id}>
            <Text style={styles.messageText}>{template.text}</Text>
            <View style={styles.actions}>
              <Button title="📢 Speak" onPress={() => {/* TODO: TTS */}} variant="ghost" size="small" />
              <Button title="Send" onPress={() => {/* TODO: Send */}} size="small" />
            </View>
          </Card>
        ))}
        
        <Text style={styles.sectionTitle}>Contacts</Text>
        {contacts.map(contact => (
          <Card key={contact.id}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactRole}>{contact.role}</Text>
            {contact.phone && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${contact.phone}`)}>
                <Text style={styles.contactPhone}>📞 {contact.phone}</Text>
              </TouchableOpacity>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.xlarge, fontWeight: TYPOGRAPHY.weights.semibold, marginVertical: SPACING.md },
  messageText: { fontSize: TYPOGRAPHY.sizes.large, marginBottom: SPACING.md },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  contactName: { fontSize: TYPOGRAPHY.sizes.large, fontWeight: TYPOGRAPHY.weights.semibold },
  contactRole: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.textSecondary, marginTop: SPACING.xs },
  contactPhone: { fontSize: TYPOGRAPHY.sizes.medium, color: COLORS.primary, marginTop: SPACING.sm },
});
