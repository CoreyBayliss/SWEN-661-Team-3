import { 
  Medication, 
  Appointment, 
  MedicationAction, 
  Contact, 
  MessageTemplate 
} from '../src/types';

describe('Medication Model Tests', () => {
  test('Medication constructor works correctly', () => {
    const now = new Date();
    const action: MedicationAction = { timestamp: now, user: 'John', action: 'taken' };
    const medication: Medication = {
      id: '1',
      name: 'Aspirin',
      dose: '81mg',
      frequency: 'Daily',
      times: ['08:00'],
      refillsRemaining: 2,
      pharmacy: 'CVS',
      lastTaken: action,
      history: [action],
    };

    expect(medication.id).toBe('1');
    expect(medication.name).toBe('Aspirin');
    expect(medication.dose).toBe('81mg');
    expect(medication.frequency).toBe('Daily');
    expect(medication.times).toEqual(['08:00']);
    expect(medication.refillsRemaining).toBe(2);
    expect(medication.pharmacy).toBe('CVS');
    expect(medication.lastTaken).toEqual(action);
    expect(medication.history).toEqual([action]);
  });

  test('Medication object can be created with all properties', () => {
    const now = new Date();
    const action: MedicationAction = { timestamp: now, user: 'John', action: 'taken' };
    const medication: Medication = {
      id: '2',
      name: 'Ibuprofen',
      dose: '200mg',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      refillsRemaining: 3,
      pharmacy: 'Walgreens',
      lastTaken: action,
      history: [action],
    };

    expect(medication.name).toBe('Ibuprofen');
    expect(medication.times.length).toBe(2);
  });

  test('Medication history can contain multiple actions', () => {
    const now = new Date();
    const action1: MedicationAction = { timestamp: now, user: 'John', action: 'taken' };
    const action2: MedicationAction = { timestamp: now, user: 'John', action: 'skipped' };
    
    const medication: Medication = {
      id: '1',
      name: 'Aspirin',
      dose: '81mg',
      frequency: 'Daily',
      times: ['08:00'],
      refillsRemaining: 2,
      pharmacy: 'CVS',
      lastTaken: action2,
      history: [action1, action2],
    };

    expect(medication.history.length).toBe(2);
    expect(medication.lastTaken.action).toBe('skipped');
  });

  test('MedicationAction constructor works correctly', () => {
    const now = new Date();
    const action: MedicationAction = { timestamp: now, user: 'John', action: 'skipped' };

    expect(action.timestamp).toBe(now);
    expect(action.user).toBe('John');
    expect(action.action).toBe('skipped');
  });

  test('MedicationAction default action is taken', () => {
    const now = new Date();
    const action: MedicationAction = { timestamp: now, user: 'John', action: 'taken' };

    expect(action.action).toBe('taken');
  });
});

describe('Appointment Model Tests', () => {
  test('Appointment constructor works correctly', () => {
    const now = new Date();
    const appointment: Appointment = {
      id: '1',
      title: 'Checkup',
      date: now,
      time: '10:00 AM',
      location: 'Clinic',
      provider: 'Dr. Smith',
    };

    expect(appointment.id).toBe('1');
    expect(appointment.title).toBe('Checkup');
    expect(appointment.date).toBe(now);
    expect(appointment.time).toBe('10:00 AM');
    expect(appointment.location).toBe('Clinic');
    expect(appointment.provider).toBe('Dr. Smith');
  });

  test('Appointment can be created with optional fields', () => {
    const now = new Date();
    const appointment: Appointment = {
      id: '2',
      title: 'Follow-up',
      date: now,
      time: '2:00 PM',
      location: 'Hospital',
      provider: 'Dr. Jones',
      notes: 'Bring test results',
      reminderSet: true,
    };

    expect(appointment.notes).toBe('Bring test results');
    expect(appointment.reminderSet).toBe(true);
  });

  test('Appointment date is stored correctly', () => {
    const testDate = new Date('2026-03-15');
    const appointment: Appointment = {
      id: '1',
      title: 'Annual Physical',
      date: testDate,
      time: '9:00 AM',
      location: 'Medical Center',
      provider: 'Dr. Williams',
    };

    expect(appointment.date.getFullYear()).toBe(2026);
    expect(appointment.date.getMonth()).toBe(2); // March is month 2 (0-indexed)
    expect(appointment.date.getDate()).toBe(15);
  });
});

describe('Contact Model Tests', () => {
  test('Contact constructor works correctly', () => {
    const contact: Contact = {
      id: '1',
      name: 'Dr. Smith',
      role: 'Primary Care',
      phone: '555-1234',
    };

    expect(contact.id).toBe('1');
    expect(contact.name).toBe('Dr. Smith');
    expect(contact.role).toBe('Primary Care');
    expect(contact.phone).toBe('555-1234');
  });

  test('Contact with email works correctly', () => {
    const contact: Contact = {
      id: '2',
      name: 'Dr. Jones',
      role: 'Specialist',
      phone: '555-5678',
      email: 'dr.jones@example.com',
    };

    expect(contact.email).toBe('dr.jones@example.com');
  });
});

describe('MessageTemplate Model Tests', () => {
  test('MessageTemplate constructor works correctly', () => {
    const template: MessageTemplate = {
      id: '1',
      title: 'Refill Request',
      content: 'I need a refill for my medication.',
    };

    expect(template.id).toBe('1');
    expect(template.title).toBe('Refill Request');
    expect(template.content).toBe('I need a refill for my medication.');
  });

  test('MessageTemplate with category works correctly', () => {
    const template: MessageTemplate = {
      id: '2',
      title: 'Appointment Question',
      content: 'I have a question about my appointment.',
      category: 'Appointments',
    };

    expect(template.category).toBe('Appointments');
  });
});

describe('Model Integration Tests', () => {
  test('Medication and Appointment can be used together', () => {
    const medication: Medication = {
      id: '1',
      name: 'Aspirin',
      dose: '81mg',
      frequency: 'Daily',
      times: ['08:00'],
      refillsRemaining: 2,
      pharmacy: 'CVS',
      history: [],
    };

    const appointment: Appointment = {
      id: '1',
      title: 'Medication Review',
      date: new Date(),
      time: '10:00 AM',
      location: 'Clinic',
      provider: 'Dr. Smith',
      notes: `Review ${medication.name}`,
    };

    expect(appointment.notes).toContain('Aspirin');
  });

  test('All models can be created and used', () => {
    const medication: Medication = {
      id: '1',
      name: 'Test Med',
      dose: '100mg',
      frequency: 'Daily',
      times: ['09:00'],
      refillsRemaining: 1,
      pharmacy: 'Test Pharmacy',
      history: [],
    };

    const appointment: Appointment = {
      id: '1',
      title: 'Test Appointment',
      date: new Date(),
      time: '10:00 AM',
      location: 'Test Location',
      provider: 'Test Provider',
    };

    const contact: Contact = {
      id: '1',
      name: 'Test Contact',
      role: 'Test Role',
      phone: '555-0000',
    };

    const template: MessageTemplate = {
      id: '1',
      title: 'Test Template',
      content: 'Test content',
    };

    expect(medication).toBeTruthy();
    expect(appointment).toBeTruthy();
    expect(contact).toBeTruthy();
    expect(template).toBeTruthy();
  });
});
