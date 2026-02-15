import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { ROUTES, COLORS } from '../utils/constants';
import { useApp } from '../context/AppContext';

// Screens
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MedicationsScreen } from '../screens/MedicationsScreen';
import { MedicationDetailScreen } from '../screens/MedicationDetailScreen';
import { AddMedicationScreen } from '../screens/AddMedicationScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';
import { AddAppointmentScreen } from '../screens/AddAppointmentScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { WellnessScreen } from '../screens/WellnessScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RefillRequestScreen } from '../screens/RefillRequestScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const { settings } = useApp();
  const { leftHandMode } = settings;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          switch (route.name) {
            case ROUTES.HOME:
              iconName = focused ? 'home' : 'home-outline';
              break;
            case ROUTES.MEDICATIONS:
              iconName = focused ? 'medical' : 'medical-outline';
              break;
            case ROUTES.APPOINTMENTS:
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case ROUTES.MESSAGES:
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case ROUTES.SETTINGS:
              iconName = focused ? 'settings' : 'settings-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
        // Position tab bar based on hand mode
        tabBarPosition: leftHandMode ? 'left' : 'bottom',
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} options={{ title: 'Today' }} />
      <Tab.Screen
        name={ROUTES.MEDICATIONS}
        component={MedicationsScreen}
        options={{ title: 'Medications' }}
      />
      <Tab.Screen
        name={ROUTES.APPOINTMENTS}
        component={AppointmentsScreen}
        options={{ title: 'Calendar' }}
      />
      <Tab.Screen
        name={ROUTES.MESSAGES}
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useApp();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen
            name={ROUTES.MEDICATION_DETAIL}
            component={MedicationDetailScreen}
            options={{ headerShown: true, title: 'Medication Details' }}
          />
          <Stack.Screen
            name={ROUTES.ADD_MEDICATION}
            component={AddMedicationScreen}
            options={{ headerShown: true, title: 'Add Medication' }}
          />
          <Stack.Screen
            name={ROUTES.APPOINTMENT_DETAIL}
            component={AppointmentDetailScreen}
            options={{ headerShown: true, title: 'Appointment Details' }}
          />
          <Stack.Screen
            name={ROUTES.ADD_APPOINTMENT}
            component={AddAppointmentScreen}
            options={{ headerShown: true, title: 'Add Appointment' }}
          />
          <Stack.Screen
            name={ROUTES.REFILL_REQUEST}
            component={RefillRequestScreen}
            options={{ headerShown: true, title: 'Refill Request' }}
          />
          <Stack.Screen
            name={ROUTES.WELLNESS}
            component={WellnessScreen}
            options={{ headerShown: true, title: 'Wellness Log' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
