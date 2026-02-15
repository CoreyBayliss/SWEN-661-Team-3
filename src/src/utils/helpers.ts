import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';

export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  } catch {
    return time;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (isoString: string): string => {
  try {
    return format(parseISO(isoString), 'MMM d, yyyy h:mm a');
  } catch {
    return isoString;
  }
};

export const isOverdue = (dateString: string, time: string): boolean => {
  try {
    const [hours, minutes] = time.split(':');
    const date = parseISO(dateString);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return isPast(date);
  } catch {
    return false;
  }
};

export const getDueMedications = (
  medications: any[],
  currentDate: Date = new Date()
): any[] => {
  return medications.filter((med) => {
    // Check if any of the medication times are within the next hour
    return med.times.some((time: string) => {
      const [hours, minutes] = time.split(':');
      const medTime = new Date(currentDate);
      medTime.setHours(parseInt(hours, 10));
      medTime.setMinutes(parseInt(minutes, 10));
      
      const diffMs = medTime.getTime() - currentDate.getTime();
      const diffMins = diffMs / (1000 * 60);
      
      return diffMins >= -30 && diffMins <= 60; // Due within next hour or up to 30 min past
    });
  });
};

export const getUpcomingAppointments = (
  appointments: any[],
  //currentDate: Date = new Date()
): any[] => {
  return appointments
    .filter((apt) => {
      const aptDate = parseISO(apt.date);
      return !isPast(aptDate) || isToday(aptDate);
    })
    .sort((a, b) => {
      const dateA = parseISO(a.date);
      const dateB = parseISO(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\d{3}-\d{3}-\d{4}$/;
  return re.test(phone);
};
