import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { COLORS, SPACING, TYPOGRAPHY, ROUTES } from '../utils/constants';
import { formatTime } from '../utils/helpers';
import { Medication } from '../types';

export const MedicationsScreen: React.FC = () => {
  const navigation = useNavigation() as any;
  const { medications } = useApp();
  const [filter, setFilter] = useState<'all' | 'due' | 'refill'>('all');

  const filteredMedications = medications.filter((med) => {
    if (filter === 'refill') return med.refillsRemaining <= 1;
    // Add more filter logic as needed
    return true;
  });

  const renderMedication = ({ item }: { item: Medication }) => (
      <Card onPress={() => navigation.navigate(ROUTES.MEDICATION_DETAIL, { id: item.id })}>
        <View style={styles.medicationCard}>
          <View style={styles.medicationIcon}>
            <Icon name="medical" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{item.name}</Text>
            <Text style={styles.medicationDose}>{item.dose}</Text>
            <Text style={styles.medicationFrequency}>{item.frequency}</Text>
            <View style={styles.timesContainer}>
              {item.times.map((time, index) => (
                  <Text key={index} style={styles.time}>
                    {formatTime(time)}
                  </Text>
              ))}
            </View>
            {item.refillsRemaining <= 1 && (
                <View style={styles.refillWarning}>
                  <Icon name="warning" size={16} color={COLORS.warning} />
                  <Text style={styles.refillWarningText}>
                    {item.refillsRemaining} refill{item.refillsRemaining !== 1 ? 's' : ''} remaining
                  </Text>
                </View>
            )}
          </View>
          <Icon name="chevron-forward" size={24} color={COLORS.textSecondary} />
        </View>
      </Card>
  );

  return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Medications</Text>
          <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ADD_MEDICATION)}
              style={styles.addButton}
          >
            <Icon name="add-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filters}>
          <FilterButton label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterButton
              label="Due Soon"
              active={filter === 'due'}
              onPress={() => setFilter('due')}
          />
          <FilterButton
              label="Low Refills"
              active={filter === 'refill'}
              onPress={() => setFilter('refill')}
          />
        </View>

        <FlatList
            data={filteredMedications}
            renderItem={renderMedication}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="medical-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>No medications found</Text>
                <Button
                    title="Add Medication"
                    onPress={() => navigation.navigate(ROUTES.ADD_MEDICATION)}
                    variant="primary"
                />
              </View>
            }
        />
      </SafeAreaView>
  );
};

const FilterButton: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({
  label,
  active,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
  },
  addButton: {
    padding: SPACING.xs,
  },
  filters: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.text,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  filterTextActive: {
    color: COLORS.surface,
  },
  list: {
    padding: SPACING.lg,
  },
  medicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
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
  medicationFrequency: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  time: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  refillWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  refillWarningText: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.warning,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.large,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
});
