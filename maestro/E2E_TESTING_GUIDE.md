# CareConnect E2E Testing Guide
## End-to-End Testing with Maestro

### Overview

This directory contains Maestro E2E tests for the CareConnect React Native (Expo) application. These tests cover critical user flows and include accessibility testing to ensure the app is usable for all users.

### Prerequisites

#### System Requirements
- macOS, Windows, or Linux
- Android Studio with emulator (for Android testing)
- Xcode (for iOS testing on macOS)
- Node.js and npm/yarn
- React Native development environment

#### Installation

**Option 1: Using Homebrew (macOS)**
```bash
brew install maestro
```

**Option 2: Using direct download**
Download from: https://maestro.mobile.dev/getting-started/installation

**Option 3: Using curl (Linux/macOS)**
```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

### React Native Setup

Before running Maestro tests, ensure your React Native/Expo app is properly configured:

1. **Build the app for testing:**
   ```bash
   # For Android
   npm run android
   # or
   yarn android

   # For iOS (macOS only)
   npm run ios
   # or
   yarn ios
   ```

2. **Ensure testID props are set:** Maestro relies on `testID` props in React Native components for reliable element selection.

3. **App ID Configuration:** The app ID in YAML files is set to `com.careconnect.expo` - update this in your app.json/app.config.js if different.

### Test Flows

#### 1. Login Flow (`01_login_flow.yaml`)
**Purpose**: Test user authentication and app entry point  
**Duration**: ~30 seconds  
**Accessibility Focus**: Form field focus, password visibility toggle, screen reader support

**Steps**:
- Launch app
- Enter demo credentials (username: "demo", password: "demo123")
- Verify login success
- Test logout flow

**Accessibility Tests**:
- Login screen is accessible
- Username field is focusable and has proper label
- Password visibility toggle has accessible label
- Success confirmation is communicated

**React Native Specific**:
- Uses `inputText` instead of `typeText` for text input
- testID props: `password-visibility-toggle`, `home-screen`, `settings-button`

---

#### 2. Medication Management (`02_medication_management.yaml`)
**Purpose**: Test medication viewing, adding, and management  
**Duration**: ~45 seconds  
**Accessibility Focus**: List navigation, form completion, feedback messages

**Steps**:
- Navigate to Medications screen
- View existing medications
- Tap on medication to view details
- Add new medication via form
- Verify medication was added

**Accessibility Tests**:
- Medications list is scrollable and accessible
- Each medication card announces details via accessibilityLabel
- Form labels are clear and announced
- Frequency dropdown options are accessible
- Success messages are communicated

**React Native Specific**:
- testID props: `medications-list`, `medication-card`, `add-medication-button`
- Uses FlatList for medication list
- Form fields use proper `accessibleLabel` props

---

#### 3. Appointments Flow (`03_appointments_flow.yaml`)
**Purpose**: Test appointment viewing, scheduling, and management  
**Duration**: ~50 seconds  
**Accessibility Focus**: Calendar navigation, date selection, appointment details

**Steps**:
- Navigate to Appointments/Calendar
- Select a date
- View appointments for that date
- View appointment details
- Set appointment reminder
- Add new appointment

**Accessibility Tests**:
- Calendar is navigable and accessible
- Selected date is announced
- Appointment times are readable
- Form fields have proper labels
- Confirmations are communicated

**React Native Specific**:
- testID props: `calendar-view`, `calendar-date`, `appointment-card`
- May use react-native-calendars or similar library
- Date picker integration for React Native

---

#### 4. Refill Request Flow (`04_refill_request_flow.yaml`)
**Purpose**: Test prescription refill request process  
**Duration**: ~40 seconds  
**Accessibility Focus**: Form navigation, picker selection, validation

**Steps**:
- Navigate to medication with low refills
- Tap request refill button
- Fill refill request form:
  - Pharmacy name
  - Pickup method (radio button)
  - Optional notes
- Submit request
- Verify submission success

**Accessibility Tests**:
- Form fields are clearly labeled
- Radio button selections are announced
- Text field placeholders are spoken
- Validation errors are announced
- Success confirmation is accessible

---

#### 5. Settings & Accessibility (`05_settings_accessibility_flow.yaml`)
**Purpose**: Test app settings and accessibility configuration  
**Duration**: ~60 seconds  
**Accessibility Focus**: Toggle switches, preference testing, app-wide accessibility

**Steps**:
- Navigate to Settings
- Configure accessibility options:
  - Left-hand mode
  - Text size
  - Screen reader mode
  - High contrast
  - Biometric settings
- Test notification preferences
- Test appearance settings
- Verify settings are applied app-wide

**Accessibility Tests**:
- All settings sections are announced
- Toggle switches are keyboard accessible
- Selection changes are confirmed
- Text size changes are verified visually
- Screen reader mode functions correctly
- High contrast mode enhances readability

---

### Running Tests

#### Run All Tests
```bash
maestro test maestro/
```

#### Run Specific Test
```bash
maestro test maestro/01_login_flow.yaml
```

#### Run Tests with Accessibility Focus
```bash
maestro test maestro/ --include-tags accessibility
```

#### Run Critical Flows Only
```bash
maestro test maestro/ --include-tags critical
```

#### Run on Specific Device
```bash
maestro test maestro/ -d iPhone_14
```

#### Run with Video Recording
```bash
maestro test maestro/ --record-video
```

#### Run with Screenshots
```bash
maestro test maestro/ --take-screenshots
```

### Test Reports

Tests generate reports in `maestro/reports/` directory:

- `test_results.json` - Detailed test results
- `test_summary.txt` - Summary report
- `screenshots/` - Screenshots from test runs
- `videos/` - Video recordings of test runs

### CI/CD Integration

#### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Maestro
        run: brew install maestro
      
      - name: Start Simulator
        run: xcrun simctl boot "iPhone 14"
      
      - name: Build Flutter App
        run: flutter build ios --simulator
      
      - name: Run E2E Tests
        run: maestro test maestro/
      
      - name: Upload Reports
        if: always()
        uses: actions/upload-artifact@v2
        with:
          name: maestro-reports
          path: maestro/reports/
```

### Accessibility Testing Best Practices

1. **Screen Reader Testing**
   - Enable screen reader before running tests
   - Verify all interactive elements are announced
   - Check that content is in logical reading order
   - Ensure form fields have associated labels

2. **Keyboard Navigation**
   - All functionality must be accessible via keyboard
   - Tab order should be logical
   - All buttons and links should be keyboard accessible
   - Modal dialogs should trap focus

3. **Visual Accessibility**
   - Ensure sufficient color contrast (WCAG AA minimum 4.5:1)
   - Text must be resizable
   - Don't rely on color alone to convey information
   - Support high contrast mode

4. **Motor Accessibility**
   - Touch targets should be at least 44x44 points
   - Forms should support auto-fill
   - Avoid time-sensitive interactions
   - Provide alternative input methods

### Test Coverage

| Flow | Coverage | Critical | Accessibility |
|------|----------|----------|---|
| Login | High | Yes | Yes |
| Medications | High | Yes | Yes |
| Appointments | High | Yes | Yes |
| Refills | Medium | Yes | Yes |
| Settings | High | Yes | Yes |

### Troubleshooting

#### Test Hangs on Startup
```bash
# Verify Flutter build
flutter build apk
# Or for iOS
flutter build ios --simulator
```

#### Device Not Found
```bash
# List available devices
maestro device list

# Start specific device
xcrun simctl boot "iPhone 14"
```

#### Flaky Tests
- Increase wait times in test YAML
- Add retry configuration
- Check device performance
- Review logs: `maestro logs`

#### Screen Reader Not Working
```bash
# Enable accessibility in settings
# iOS: Settings > Accessibility > VoiceOver
# Android: Settings > Accessibility > TalkBack
```

### Performance Metrics

Expected test durations:
- Single flow: 30-60 seconds
- All flows: 5-10 minutes
- With video recording: Add 50% time

### Best Practices

1. **Test Organization**
   - Group related tests
   - Use descriptive names
   - Add comments explaining complex flows

2. **Maintenance**
   - Keep element IDs stable
   - Update tests when UI changes
   - Version control test changes
   - Document known flakiness

3. **Reporting**
   - Generate reports in CI/CD
   - Archive reports for analysis
   - Monitor test trends
   - Alert on failures

### Advanced Configuration

#### Custom Wait Strategies
```yaml
- waitForAnimationToEnd:
    timeout: 5000

- waitForElementWithText:
    text: "Expected Text"
    timeout: 3000
```

#### Conditional Logic
```yaml
- tapOn:
    id: "button"

- runFlow: "nested_flow"

- assertVisible:
    id: "expected_element"
```

#### Data-Driven Testing
```yaml
- runFlow: "test_template"
  with:
    medication_name: "Aspirin"
    dosage: "500mg"
```

### Support and Resources

- **Maestro Documentation**: https://maestro.mobile.dev/
- **Flutter Testing**: https://flutter.dev/docs/testing
- **Accessibility Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **iOS Accessibility**: https://developer.apple.com/accessibility/ios/
- **Android Accessibility**: https://developer.android.com/guide/topics/ui/accessibility

### Contributing

When adding new tests:
1. Follow existing naming conventions
2. Include accessibility checks
3. Add comments explaining complex flows
4. Test on both iOS and Android
5. Document any new patterns

---

**Last Updated**: February 17, 2026  
**Maestro Version**: 1.35.0+  
**Flutter Version**: 3.x+
