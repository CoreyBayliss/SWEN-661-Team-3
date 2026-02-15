import {
  formatTime,
  formatDate,
  formatDateTime,
  isOverdue,
  getDueMedications,
  getUpcomingAppointments,
  generateId,
  validateEmail,
  validatePhone,
} from '../../src/utils/helpers';

describe('Helper Functions', () => {
  describe('formatTime', () => {
    it('should format time correctly', () => {
      expect(formatTime('09:00')).toBe('9:00 AM');
      expect(formatTime('13:30')).toBe('1:30 PM');
      expect(formatTime('00:00')).toBe('12:00 AM');
      expect(formatTime('12:00')).toBe('12:00 PM');
    });

    it('should handle invalid time gracefully', () => {
      expect(formatTime('invalid')).toBe('invalid');
      expect(formatTime('')).toBe('');
    });
  });

  describe('formatDate', () => {
    it('should format today as "Today"', () => {
      const today = new Date().toISOString();
      expect(formatDate(today)).toBe('Today');
    });

    it('should format tomorrow as "Tomorrow"', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatDate(tomorrow.toISOString())).toBe('Tomorrow');
    });

    it('should format other dates correctly', () => {
      expect(formatDate('2026-03-15')).toMatch(/Mar 15, 2026/);
    });

    it('should handle invalid date gracefully', () => {
      expect(formatDate('invalid')).toBe('invalid');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const result = formatDateTime('2026-02-14T14:30:00.000Z');
      expect(result).toMatch(/Feb 14, 2026/);
      expect(result).toMatch(/PM | AM/);
    });

    it('should handle invalid datetime gracefully', () => {
      expect(formatDateTime('invalid')).toBe('invalid');
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateString = yesterday.toISOString().split('T')[0];
      
      expect(isOverdue(dateString, '09:00')).toBe(true);
    });

    it('should return false for future dates', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      
      expect(isOverdue(dateString, '09:00')).toBe(false);
    });

    it('should handle invalid input gracefully', () => {
      expect(isOverdue('invalid', 'invalid')).toBe(false);
    });
  });

  describe('getDueMedications', () => {
    const createMedication = (id: string, times: string[]) => ({
      id,
      name: `Medication ${id}`,
      dose: '10mg',
      frequency: 'Daily',
      times,
      refillsRemaining: 2,
      pharmacy: 'Test Pharmacy',
      history: [],
    });

    it('should return medications due within the next hour', () => {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 30 * 60000);
      const timeString = `${nextHour.getHours().toString().padStart(2, '0')}:${nextHour.getMinutes().toString().padStart(2, '0')}`;

      const medications = [
        createMedication('1', [timeString]),
        createMedication('2', ['23:59']),
      ];

      const due = getDueMedications(medications, now);
      expect(due).toHaveLength(1);
      expect(due[0].id).toBe('1');
    });

    it('should return empty array when no medications are due', () => {
      const medications = [
        createMedication('1', ['23:59']),
        createMedication('2', ['23:58']),
      ];

      const now = new Date();
      now.setHours(12, 0, 0, 0);

      const due = getDueMedications(medications, now);
      expect(due).toHaveLength(0);
    });

    it('should handle empty medication list', () => {
      const due = getDueMedications([]);
      expect(due).toHaveLength(0);
    });
  });

  describe('getUpcomingAppointments', () => {
    const createAppointment = (id: string, date: string) => ({
      id,
      title: `Appointment ${id}`,
      date,
      time: '10:00',
      location: 'Test Location',
      provider: 'Dr. Test',
    });

    it('should return upcoming appointments sorted by date', () => {
      const future1 = new Date();
      future1.setDate(future1.getDate() + 2);
      const future2 = new Date();
      future2.setDate(future2.getDate() + 1);
      const future3 = new Date();
      future3.setDate(future3.getDate() + 3);

      const appointments = [
        createAppointment('1', future1.toISOString().split('T')[0]),
        createAppointment('2', future2.toISOString().split('T')[0]),
        createAppointment('3', future3.toISOString().split('T')[0]),
      ];

      const upcoming = getUpcomingAppointments(appointments);
      expect(upcoming).toHaveLength(3);
      expect(upcoming[0].id).toBe('2'); // Closest date first
      expect(upcoming[1].id).toBe('1');
      expect(upcoming[2].id).toBe('3');
    });

    it('should limit to 3 appointments', () => {
      const appointments = Array.from({ length: 5 }, (_, i) => {
        const future = new Date();
        future.setDate(future.getDate() + i + 1);
        return createAppointment(i.toString(), future.toISOString().split('T')[0]);
      });

      const upcoming = getUpcomingAppointments(appointments);
      expect(upcoming).toHaveLength(3);
    });

    it('should exclude past appointments except today', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const today = new Date();
      const future = new Date();
      future.setDate(future.getDate() + 1);

      const appointments = [
        createAppointment('1', past.toISOString().split('T')[0]),
        createAppointment('2', today.toISOString().split('T')[0]),
        createAppointment('3', future.toISOString().split('T')[0]),
      ];

      const upcoming = getUpcomingAppointments(appointments);
      expect(upcoming.length).toBeGreaterThanOrEqual(2);
      expect(upcoming.find((a) => a.id === '1')).toBeUndefined();
    });

    it('should handle empty appointment list', () => {
      const upcoming = getUpcomingAppointments([]);
      expect(upcoming).toHaveLength(0);
    });
  });

  describe('generateId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it('should generate string ID', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('555-123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('1234567890')).toBe(false);
      expect(validatePhone('123-45-6789')).toBe(false);
      expect(validatePhone('123-456-789')).toBe(false);
      expect(validatePhone('abc-def-ghij')).toBe(false);
      expect(validatePhone('')).toBe(false);
    });
  });
});
