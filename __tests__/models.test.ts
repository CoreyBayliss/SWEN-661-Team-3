import { Medication, Appointment, Contact, MessageTemplate } from '../src/types';

describe('Model Types', () => {
  describe('Medication', () => {
    it('can be created with required fields', () => {
      const medication: Medication = {
        id: '1',
        name: 'Test मेड',
        dose: '10mg',
        frequency: 'Once daily',
        times: ['09:00'],
        refillsRemaining: 3,
        pharmacy: 'Test Pharmacy',
        history: [],
      };

      expect(medication.id).toBe('1');
      expect(medication.name).toBe('Test मेड');
      expect(medication.lastTaken).toBeUndefined();
    });

    it('supports creating updated copies via object spread', () => {
      const original: Medication = {
        id: '1',
        name: 'Original',
        dose: '10mg',
        frequency: 'Once daily',
        times: ['09:00'],
        refillsRemaining: 3,
        pharmacy: 'Pharmacy A',
        history: [],
      };

      const updated: Medication = { ...original, name: 'Updated', refillsRemaining: 5 };

      expect(updated.id).toBe(original.id);
      expect(updated.name).toBe('Updated');
      expect(updated.refillsRemaining).toBe(5);
    });

    it('allows multiple times', () => {
      const medication: Medication = {
        id: '1',
        name: 'Test',
        dose: '10mg',
        frequency: 'Four times daily',
        times: ['08:00', '12:00', '16:00', '20:00'],
        refillsRemaining: 3,
        pharmacy: 'Pharmacy',
        history: [],
      };

      expect(medication.times).toHaveLength(4);
    });
  });

  describe('Appointment', () => {
    it('can be created', () => {
      const appointment: Appointment = {
        id: '1',
        title: 'Doctor Visit',
        date: '2026-03-15',
        time: '14:00',
        location: 'Medical Center',
        provider: 'Dr. Smith',
      };

      expect(appointment.title).toBe('Doctor Visit');
      expect(appointment.date).toBe('2026-03-15');
    });

    it('supports creating updated copies via object spread', () => {
      const original: Appointment = {
        id: '1',
        title: 'Original Title',
        date: '2026-03-15',
        time: '14:00',
        location: 'Location A',
        provider: 'Dr. A',
      };

      const updated: Appointment = { ...original, title: 'Updated Title', date: '2026-03-20' };

      expect(updated.id).toBe(original.id);
      expect(updated.title).toBe('Updated Title');
      expect(updated.date).toBe('2026-03-20');
    });
  });

  describe('Contact', () => {
    it('can be created with phone', () => {
      const contact: Contact = {
        id: '1',
        name: 'Dr. Smith',
        role: 'Primary Care',
        phone: '555-1234',
      };

      expect(contact.phone).toBe('555-1234');
    });

    it('can be created without phone', () => {
      const contact: Contact = {
        id: '1',
        name: 'Dr. Smith',
        role: 'Primary Care',
      };

      expect(contact.phone).toBeUndefined();
    });
  });

  describe('MessageTemplate', () => {
    it('supports multiple categories', () => {
      const categories = ['appointment', 'update', 'wellness', 'urgent'];

      categories.forEach((category) => {
        const template: MessageTemplate = {
          id: '1',
          text: 'Test',
          category,
        };

        expect(template.category).toBe(category);
      });
    });
  });
});
