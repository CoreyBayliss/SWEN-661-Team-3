# CareConnect E2E Tests with Maestro (React Native)

## Overview

This directory contains **End-to-End (E2E) tests** for the CareConnect React Native (Expo) application using **Maestro**, a mobile testing framework. The test suite covers 5 critical user flows with comprehensive accessibility testing.

## Test Coverage

| # | Flow | Duration | Accessibility | Type |
|---|------|----------|---|---|
| 1 | Login Flow | ~30s | ✓ Screen Reader, Keyboard | Critical |
| 2 | Medication Management | ~45s | ✓ List Nav, Form Labels | Critical |
| 3 | Appointments | ~50s | ✓ Calendar, Date Selection | Critical |
| 4 | Refill Requests | ~40s | ✓ Form Navigation | Critical |
| 5 | Settings & Accessibility | ~60s | ✓ All Accessibility Options | Critical |

**Total Runtime**: ~4 minutes

## Quick Start

### Prerequisites

1. **Maestro Installation**
   ```bash
   # macOS
   brew install maestro
   
   # Linux/macOS (using curl)
   curl -Ls "https://get.maestro.mobile.dev" | bash
   
   # Windows - Download from https://maestro.mobile.dev
   ```

2. **React Native Setup**
   ```bash
   # Install dependencies
   npm install  # or yarn install
   
   # Start Metro bundler
   npm start
   
   # In another terminal, run the app
   npm run android  # For Android
   npm run ios      # For iOS (macOS only)
   ```

3. **Device/Emulator**
   - Android: Ensure Android emulator is running or device is connected
   - iOS: Open Simulator

### Running Tests

**Quick Start - All Tests**
```bash
# macOS/Linux
./run_e2e_tests.sh

# Windows
run_e2e_tests.bat
```

**Run Specific Flow**
```bash
maestro test 01_login_flow.yaml
maestro test 02_medication_management.yaml
maestro test 03_appointments_flow.yaml
maestro test 04_refill_request_flow.yaml
maestro test 05_settings_accessibility_flow.yaml
```

**Run with Maestro Studio (Interactive)**
```bash
maestro studio
# Then open and run tests interactively
```

## React Native Specific Notes

### TestID Props
Maestro relies on `testID` props for reliable element selection. Ensure your components have proper testIDs:

```tsx
<View testID="home-screen">
  <TouchableOpacity testID="add-medication-button">
    <Text>Add Medication</Text>
  </TouchableOpacity>
  <TextInput testID="medication-name-field" placeholder="Medication name" />
</View>
```

### Important TestIDs Used in Tests
- `password-visibility-toggle` - Password show/hide button
- `medications-list` - FlatList of medications
- `medication-card` - Individual medication card
- `add-medication-button` - Add new medication button
- `calendar-view` - Calendar component
- `appointment-card` - Appointment card in list
- `settings-button` - Settings navigation button

### App ID Configuration
The tests use `com.careconnect.expo` as the app ID. Ensure this matches in your `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.careconnect.expo"
    },
    "android": {
      "package": "com.careconnect.expo"
    }
  }
}
```

### Text Input
React Native uses `inputText` in Maestro instead of `typeText`:
```yaml
- tapOn:
    id: "username-field"
- inputText: "demo"
```

## Test Details

### 1. Login Flow (`01_login_flow.yaml`)

**What it tests:**
- User authentication
- Form input and validation
- Navigation to home screen
- Logout functionality

**Demo Credentials:**
- Username: `demo`
- Password: `demo123`

---

### 2. Medication Management (`02_medication_management.yaml`)

**What it tests:**
- View medication list
- View medication details
- Add new medication
- Form submission

**Test Data:**
- Adds: "Test Medication" (500mg, Daily)

---

### 3. Appointments Flow (`03_appointments_flow.yaml`)

**What it tests:**
- Calendar navigation
- Appointment viewing
- Appointment details display
- Add new appointment

---

### 4. Refill Request Flow (`04_refill_request_flow.yaml`)

**What it tests:**
- Identify medications needing refills
- Complete refill request form
- Submit refill request

---

### 5. Settings & Accessibility (`05_settings_accessibility_flow.yaml`)

**What it tests:**
- Left-hand mode toggle
- Text size adjustment
- High contrast mode
- Biometric settings
- Notification preferences

---

## Accessibility Testing

### Screen Reader Compatibility
Tests verify:
- ✓ All elements have proper `accessibilityLabel`
- ✓ Form labels associated with inputs
- ✓ Interactive elements have accessible names
- ✓ State changes are communicated

### Keyboard Navigation
Tests ensure:
- ✓ All interactive elements reachable
- ✓ Logical focus order
- ✓ Form submission works with keyboard

### Visual Accessibility
Tests check:
- ✓ Sufficient color contrast
- ✓ Text resizable
- ✓ High contrast mode supported

### Touch Targets
Tests verify:
- ✓ Touch targets ≥ 44x44 points
- ✓ Sufficient spacing between controls

## CI/CD Integration

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Install Maestro
        run: brew install maestro
      
      - name: Build App
        run: npm run android  # or ios
      
      - name: Run E2E Tests
        run: maestro test _maestro/
      
      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: maestro-reports
          path: _maestro/reports/
```

## Troubleshooting

### App Not Launching
- Ensure Metro bundler is running: `npm start`
- Verify app is built: `npm run android` or `npm run ios`
- Check app ID matches in YAML files
- Ensure emulator/simulator is running

### Elements Not Found
- Add proper `testID` props to React Native components
- Use `accessibilityLabel` for text-based matching
- Use Maestro Studio to inspect element hierarchy
- Check element visibility and rendering

### Test Timeout
- Increase wait times: `waitForAnimationToEnd: 5000`
- Check for loading states blocking UI
- Ensure Metro bundler is running smoothly

### Text Input Not Working
- Use `inputText` instead of `typeText`
- Ensure TextInput components are properly focused
- Check keyboard dismissal isn't blocking input

## Debug Mode

Use Maestro Studio for interactive debugging:
```bash
maestro studio
```

Features:
- Inspect element hierarchy
- Test selectors
- Record flows
- Debug failing tests
- View device screen in real-time

## Best Practices

### Component Setup
Always add testIDs to interactive elements:
```tsx
<TouchableOpacity testID="submit-button">
  <Text>Submit</Text>
</TouchableOpacity>
```

### Accessibility Labels
Provide meaningful accessibility labels:
```tsx
<TouchableOpacity 
  testID="delete-button"
  accessibilityLabel="Delete medication"
  accessibilityHint="Double tap to delete this medication"
>
  <Icon name="trash" />
</TouchableOpacity>
```

### Wait for Animations
Always wait for animations to complete:
```yaml
- tapOn:
    id: "submit-button"
- waitForAnimationToEnd
```

## File Structure

```
_maestro/
├── 01_login_flow.yaml              # Login and authentication
├── 02_medication_management.yaml   # Medications CRUD
├── 03_appointments_flow.yaml       # Calendar and appointments
├── 04_refill_request_flow.yaml     # Refill workflow
├── 05_settings_accessibility_flow.yaml # Settings
├── maestro.yaml                    # Configuration
├── E2E_TESTING_GUIDE.md            # Detailed guide
├── run_e2e_tests.sh                # Unix runner
├── run_e2e_tests.bat               # Windows runner
└── README.md                       # This file
```

## Resources

- **Maestro Docs**: https://maestro.mobile.dev/
- **React Native Testing**: https://reactnative.dev/docs/testing-overview
- **React Native Accessibility**: https://reactnative.dev/docs/accessibility
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

## Contributing

When adding new E2E tests:
1. Follow existing file naming pattern
2. Include accessibility checks
3. Add descriptive comments
4. Test on both iOS and Android
5. Update this README
6. Ensure proper testID props in components

---

**Last Updated**: February 17, 2026  
**Maestro Version**: 1.35.0+  
**React Native Version**: 0.81+  
**Expo SDK**: 54+
