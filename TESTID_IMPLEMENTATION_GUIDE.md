# Implementation Guide: Adding TestIDs to React Native Components

## Overview
This guide helps you add the necessary `testID` props to your React Native components to support the converted Maestro E2E tests.

## Required TestIDs by Screen

### LoginScreen.tsx
```tsx
<View testID="login-screen">
  <TextInput
    testID="username-field"
    placeholder="Username"
    accessibilityLabel="Username"
  />
  
  <TextInput
    testID="password-field"
    placeholder="Password"
    secureTextEntry={showPassword}
    accessibilityLabel="Password"
  />
  
  <TouchableOpacity testID="password-visibility-toggle">
    <Icon name={showPassword ? "eye-off" : "eye"} />
  </TouchableOpacity>
  
  <TouchableOpacity testID="sign-in-button">
    <Text>Sign In</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="biometric-login-button">
    <Icon name="fingerprint" />
  </TouchableOpacity>
</View>
```

### HomeScreen.tsx
```tsx
<View testID="home-screen">
  <Text>Health Overview</Text>
  
  <TouchableOpacity testID="settings-button">
    <Icon name="settings" />
  </TouchableOpacity>
  
  <TouchableOpacity testID="medications-button">
    <Text>Medications</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="appointments-button">
    <Text>Appointments</Text>
  </TouchableOpacity>
</View>
```

### MedicationsScreen.tsx
```tsx
<View testID="medications-screen">
  <FlatList
    testID="medications-list"
    data={medications}
    renderItem={({ item, index }) => (
      <TouchableOpacity 
        testID={`medication-card-${index}`}
        key={item.id}
        accessibilityLabel={`${item.name}, ${item.dose}`}
      >
        <View testID="medication-card">
          <Text testID="medication-name">{item.name}</Text>
          <Text testID="medication-dose">{item.dose}</Text>
          <Text testID="medication-frequency">{item.frequency}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
  
  <TouchableOpacity testID="add-medication-button">
    <Icon name="plus" />
    <Text>Add Medication</Text>
  </TouchableOpacity>
</View>
```

### AddMedicationScreen.tsx
```tsx
<View testID="add-medication-form">
  <Text>Add Medication</Text>
  
  <TextInput
    testID="medication-name-field"
    placeholder="Medication name"
    accessibilityLabel="Medication name"
  />
  
  <TextInput
    testID="medication-dose-field"
    placeholder="Dose (e.g., 100mg)"
    accessibilityLabel="Medication dose"
  />
  
  <Picker testID="frequency-dropdown">
    <Picker.Item label="Once daily" value="daily" />
    <Picker.Item label="Twice daily" value="twice" />
  </Picker>
  
  <Picker testID="pharmacy-dropdown">
    <Picker.Item label="CVS Pharmacy" value="cvs" />
    <Picker.Item label="Walgreens" value="walgreens" />
  </Picker>
  
  <TextInput
    testID="refills-field"
    placeholder="Number of refills"
    keyboardType="numeric"
  />
  
  <TouchableOpacity testID="add-time-button">
    <Icon name="plus" />
    <Text>Add Time</Text>
  </TouchableOpacity>
  
  {times.map((time, index) => (
    <TextInput
      key={index}
      testID={`time-input-${index}`}
      value={time}
    />
  ))}
  
  <TouchableOpacity testID="submit-button">
    <Text>Add Medication</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="cancel-button">
    <Text>Cancel</Text>
  </TouchableOpacity>
</View>
```

### MedicationDetailScreen.tsx
```tsx
<View testID="medication-detail-screen">
  <TouchableOpacity testID="back-button">
    <Icon name="arrow-left" />
  </TouchableOpacity>
  
  <Text testID="medication-name">{medication.name}</Text>
  <Text testID="medication-dose">{medication.dose}</Text>
  <Text testID="medication-frequency">{medication.frequency}</Text>
  
  <TouchableOpacity testID="request-refill-button">
    <Text>Request Refill</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="edit-button">
    <Icon name="edit" />
  </TouchableOpacity>
  
  <TouchableOpacity testID="delete-button">
    <Icon name="trash" />
  </TouchableOpacity>
</View>
```

### RefillRequestScreen.tsx
```tsx
<View testID="refill-request-form">
  <Text>Request Medication Refill</Text>
  
  <View testID="medication-info">
    <Text>{medication.name}</Text>
    <Text>{medication.dose}</Text>
  </View>
  
  <TextInput
    testID="pharmacy-field"
    placeholder="Pharmacy"
  />
  
  <View testID="pickup-method-selector">
    <TouchableOpacity testID="pickup-option">
      <Text>Pickup</Text>
    </TouchableOpacity>
    <TouchableOpacity testID="delivery-option">
      <Text>Delivery</Text>
    </TouchableOpacity>
  </View>
  
  <TextInput
    testID="notes-field"
    placeholder="Additional notes"
    multiline
  />
  
  <TouchableOpacity testID="submit-request-button">
    <Text>Submit Request</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="stepper-next">
    <Text>Next</Text>
  </TouchableOpacity>
</View>

<View testID="confirmation-screen">
  <Text>Refill request submitted successfully</Text>
  <TouchableOpacity testID="back-to-medications">
    <Text>Back to Medications</Text>
  </TouchableOpacity>
</View>
```

### AppointmentsScreen.tsx
```tsx
<View testID="appointments-screen">
  <View testID="calendar-view">
    <Text>{currentMonth}</Text>
    
    <TouchableOpacity testID="prev-month-button">
      <Icon name="chevron-left" />
    </TouchableOpacity>
    
    <TouchableOpacity testID="next-month-button">
      <Icon name="chevron-right" />
    </TouchableOpacity>
    
    <View testID="current-date">
      <Text>{currentDate}</Text>
    </View>
    
    {dates.map((date, index) => (
      <TouchableOpacity
        key={date}
        testID={`calendar-date-${index}`}
      >
        <Text>{date}</Text>
      </TouchableOpacity>
    ))}
  </View>
  
  <View testID="appointments-for-date">
    {appointments.map((apt, index) => (
      <TouchableOpacity
        key={apt.id}
        testID={`appointment-card-${index}`}
      >
        <View testID="appointment-card">
          <Text testID="appointment-title">{apt.title}</Text>
          <Text testID="appointment-time">{apt.time}</Text>
          <Text testID="appointment-location">{apt.location}</Text>
          <Text testID="appointment-provider">{apt.provider}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
  
  <TouchableOpacity testID="add-appointment-button">
    <Icon name="plus" />
  </TouchableOpacity>
  
  <TouchableOpacity testID="today-button">
    <Text>Today</Text>
  </TouchableOpacity>
</View>
```

### AppointmentDetailScreen.tsx
```tsx
<View testID="appointment-detail">
  <TouchableOpacity testID="back-button">
    <Icon name="arrow-left" />
  </TouchableOpacity>
  
  <Text testID="appointment-title">{appointment.title}</Text>
  <Text testID="appointment-time">{appointment.time}</Text>
  <Text testID="appointment-location">{appointment.location}</Text>
  <Text testID="appointment-provider">{appointment.provider}</Text>
  
  <TouchableOpacity testID="set-reminder-button">
    <Icon name="bell" />
    <Text>Set Reminder</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="cancel-appointment-button">
    <Icon name="trash" />
    <Text>Cancel Appointment</Text>
  </TouchableOpacity>
</View>
```

### AddAppointmentScreen.tsx
```tsx
<View>
  <Text>Add Appointment</Text>
  
  <TextInput
    testID="appointment-title-field"
    placeholder="Appointment title"
  />
  
  <TouchableOpacity testID="appointment-date-field">
    <Text>{selectedDate}</Text>
  </TouchableOpacity>
  
  <TouchableOpacity testID="appointment-time-field">
    <Text>{selectedTime}</Text>
  </TouchableOpacity>
  
  <TextInput
    testID="appointment-location-field"
    placeholder="Location"
  />
  
  <TextInput
    testID="appointment-provider-field"
    placeholder="Provider"
  />
  
  <TouchableOpacity testID="save-appointment-button">
    <Text>Save</Text>
  </TouchableOpacity>
</View>
```

### SettingsScreen.tsx
```tsx
<View testID="settings-screen">
  <Text>Settings</Text>
  
  <TouchableOpacity testID="back-button">
    <Icon name="arrow-left" />
  </TouchableOpacity>
  
  <View>
    <Text>Accessibility</Text>
    
    <TouchableOpacity testID="left-hand-mode-toggle">
      <Text>Left-hand Mode</Text>
      <Switch value={leftHandMode} />
    </TouchableOpacity>
    
    <View testID="left-hand-mode-indicator">
      {leftHandMode && <Text>Active</Text>}
    </View>
    
    <TouchableOpacity testID="font-size-selector">
      <Text>Font Size</Text>
    </TouchableOpacity>
    
    <TouchableOpacity testID="high-contrast-toggle">
      <Text>High Contrast</Text>
      <Switch value={highContrast} />
    </TouchableOpacity>
    
    <View testID="high-contrast-indicator">
      {highContrast && <Text>Active</Text>}
    </View>
  </View>
  
  <View>
    <Text>Notifications</Text>
    
    <TouchableOpacity testID="medication-reminder-toggle">
      <Text>Medication Reminders</Text>
      <Switch value={medicationReminders} />
    </TouchableOpacity>
    
    <TouchableOpacity testID="appointment-reminder-toggle">
      <Text>Appointment Reminders</Text>
      <Switch value={appointmentReminders} />
    </TouchableOpacity>
  </View>
  
  <TouchableOpacity testID="biometric-toggle">
    <Text>Biometric Login</Text>
    <Switch value={biometricEnabled} />
  </TouchableOpacity>
  
  <TouchableOpacity testID="logout-button">
    <Text>Logout</Text>
  </TouchableOpacity>
</View>
```

## Accessibility Best Practices

### Always Include Both testID and Accessibility Props
```tsx
<TouchableOpacity
  testID="delete-button"
  accessibilityLabel="Delete medication"
  accessibilityHint="Double tap to delete this medication"
  accessibilityRole="button"
>
  <Icon name="trash" />
</TouchableOpacity>
```

### For Lists, Use Index-Based TestIDs
```tsx
<FlatList
  data={items}
  renderItem={({ item, index }) => (
    <TouchableOpacity testID={`item-card-${index}`}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>
```

### For Dynamic Content
```tsx
<TouchableOpacity 
  testID={`medication-card-${medication.id}`}
  accessibilityLabel={`${medication.name}, ${medication.dose}, ${medication.frequency}`}
>
  <Text>{medication.name}</Text>
</TouchableOpacity>
```

## Testing Your TestIDs

### Using React Native Debugger
1. Open React Native Debugger
2. Inspect element hierarchy
3. Verify testID props are present

### Using Maestro Studio
```bash
maestro studio
```
Then tap elements to see their properties and testIDs.

### Using Jest Tests
```tsx
const { getByTestId } = render(<LoginScreen />);
const button = getByTestId('sign-in-button');
expect(button).toBeTruthy();
```

## Common Patterns

### Buttons
```tsx
<TouchableOpacity testID="action-button">
  <Text>Action</Text>
</TouchableOpacity>
```

### Text Inputs
```tsx
<TextInput
  testID="input-field"
  accessibilityLabel="Field label"
  placeholder="Enter text"
/>
```

### Lists
```tsx
<FlatList
  testID="item-list"
  data={data}
/>
```

### Modals
```tsx
<Modal testID="confirmation-modal" visible={visible}>
  <View testID="modal-content">
    <Text>Are you sure?</Text>
    <TouchableOpacity testID="confirm-button">
      <Text>Confirm</Text>
    </TouchableOpacity>
    <TouchableOpacity testID="cancel-button">
      <Text>Cancel</Text>
    </TouchableOpacity>
  </View>
</Modal>
```

## Verification Checklist

Before running E2E tests, verify:
- [ ] All interactive elements have testID props
- [ ] TestIDs use kebab-case naming
- [ ] TestIDs are unique within each screen
- [ ] Lists use index-based testIDs
- [ ] Accessibility labels complement testIDs
- [ ] Navigation buttons have testIDs
- [ ] Form fields have testIDs
- [ ] Modals and overlays have testIDs

## Running Tests After Implementation

1. **Run Jest tests to verify testIDs:**
   ```bash
   npm run test:screens
   ```

2. **Build and run the app:**
   ```bash
   npm run android  # or npm run ios
   ```

3. **Run Maestro tests:**
   ```bash
   npm run test:e2e
   ```

4. **Debug with Maestro Studio:**
   ```bash
   maestro studio
   ```

## Troubleshooting

### TestID Not Found in Maestro
- Verify testID prop is set correctly
- Check component is rendered and visible
- Use Maestro Studio to inspect hierarchy
- Ensure no typos in testID name

### Multiple Elements with Same TestID
- Use unique testIDs (e.g., include index for lists)
- Check for duplicate testID assignments
- Use component-specific prefixes

### TestID Works in Jest but Not Maestro
- Ensure app is rebuilt with latest code
- Check element is actually visible on screen
- Verify Metro bundler is running
- Try restarting the app

---

**Note**: After adding all testIDs, rebuild your app before running Maestro tests:
```bash
npm run android  # or npm run ios
```
