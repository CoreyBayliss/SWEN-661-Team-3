# CareConnect E2E Tests with Maestro

## Overview

This directory contains **End-to-End (E2E) tests** for the CareConnect Flutter application using **Maestro**, a mobile testing framework. The test suite covers 5 critical user flows with comprehensive accessibility testing.

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
   
   # Or download from
   # https://maestro.mobile.dev/getting-started/installation
   ```

2. **Flutter Setup**
   ```bash
   flutter doctor
   ```

3. **Android/iOS Emulator**
   - Android: `flutter emulators --launch android_emulator`
   - iOS: `open -a Simulator`

### Running Tests

**Quick Start - All Tests**
```bash
# macOS/Linux
./maestro/run_e2e_tests.sh --all

# Windows
maestro\run_e2e_tests.bat --all
```

**Run Specific Flow**
```bash
./maestro/run_e2e_tests.sh --login          # Login test
./maestro/run_e2e_tests.sh --medications    # Medications test
./maestro/run_e2e_tests.sh --appointments   # Calendar test
./maestro/run_e2e_tests.sh --refills        # Refill test
./maestro/run_e2e_tests.sh --settings       # Settings test
```

**Run with Accessibility Focus**
```bash
./maestro/run_e2e_tests.sh --all --accessibility
```

**Run with Video Recording**
```bash
./maestro/run_e2e_tests.sh --all --video
```

## Test Details

### 1. Login Flow (`01_login_flow.yaml`)

**What it tests:**
- User authentication
- Form input and validation
- Navigation to home screen
- Logout functionality

**Accessibility features tested:**
- ✓ Form labels are announced by screen reader
- ✓ Password visibility toggle is accessible
- ✓ Login success is confirmed audibly
- ✓ All fields are keyboard navigable

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

**Accessibility features tested:**
- ✓ Medication list scrollable with keyboard
- ✓ Each card announces medication name and dose
- ✓ Form labels clearly associated with inputs
- ✓ Dropdown selections announced
- ✓ Success messages spoken aloud

**Test Data:**
- Adds: "Test Medication" (500mg, Daily)

---

### 3. Appointments Flow (`03_appointments_flow.yaml`)

**What it tests:**
- Calendar navigation
- Appointment viewing
- Appointment details display
- Set reminder
- Cancel appointment
- Today view

**Accessibility features tested:**
- ✓ Calendar navigable with arrow keys
- ✓ Selected date is announced
- ✓ Appointment times readable
- ✓ Cancel action has confirmation (accessibility safe)
- ✓ Reminder confirmations spoken

---

### 4. Refill Request Flow (`04_refill_request_flow.yaml`)

**What it tests:**
- Identify low-refill medications
- Request refill form
- Form completion
- Refill request submission
- Duplicate refill prevention

**Accessibility features tested:**
- ✓ Form fields labeled clearly
- ✓ Radio button selections announced
- ✓ Text field placeholders spoken
- ✓ Validation errors announced
- ✓ Success confirmation accessible

**Form Fields:**
- Pharmacy name: "CVS Pharmacy"
- Pickup method: Radio selection
- Notes: Optional text

---

### 5. Settings & Accessibility (`05_settings_accessibility_flow.yaml`)

**What it tests:**
- Accessibility settings:
  - Left-hand mode
  - Text size adjustment
  - Screen reader mode
  - High contrast mode
  - Biometric settings
- Notification preferences
- Appearance/theme settings
- Language selection

**Accessibility features tested:**
- ✓ All settings sections announced
- ✓ Toggle switches keyboard accessible
- ✓ Selection changes confirmed
- ✓ Text size changes verified
- ✓ Screen reader mode functions
- ✓ High contrast enhances readability

---

## File Structure

```
maestro/
├── 01_login_flow.yaml              # Login and authentication
├── 02_medication_management.yaml   # Medications CRUD
├── 03_appointments_flow.yaml       # Calendar and appointments
├── 04_refill_request_flow.yaml     # Refill workflow
├── 05_settings_accessibility_flow.yaml # Settings and accessibility
├── maestro.yaml                    # Master configuration
├── E2E_TESTING_GUIDE.md            # Comprehensive guide
├── run_e2e_tests.sh                # macOS/Linux runner
├── run_e2e_tests.bat               # Windows runner
└── README.md                       # This file
```

## Advanced Usage

### Run with Specific Options

```bash
# With video and screenshots
./maestro/run_e2e_tests.sh --all --video --screenshots

# Focus on accessibility tests
./maestro/run_e2e_tests.sh --all --accessibility

# Specific device
./maestro/run_e2e_tests.sh --all -d "iPhone_14"

# Multiple options
./maestro/run_e2e_tests.sh --medications --video --screenshots
```

### Direct Maestro Commands

```bash
# List available devices
maestro device list

# Run specific test with custom device
maestro test maestro/01_login_flow.yaml -d Android_Pixel_6

# View maestro version
maestro --version

# Check connection to device
maestro device info
```

## Test Reports

After running tests, reports are generated in `maestro/reports/`:

```
maestro/reports/
├── test_results.json       # Detailed test results
├── test_summary.txt        # Summary report
├── screenshots/            # Test screenshots
└── videos/                 # Test recordings (if --video used)
```

### Reading Reports

**JSON Results** (`test_results.json`):
```json
{
  "flow": "01_login_flow",
  "status": "PASSED",
  "duration_seconds": 28,
  "device": "iPhone_14",
  "accessibility_checks": [
    {
      "check": "form_labels_announced",
      "passed": true
    }
  ]
}
```

## Accessibility Testing Details

### Screen Reader Compatibility

Tests verify that:
- ✓ All text is announced by screen reader
- ✓ Form labels associated with inputs
- ✓ Interactive elements have accessible names
- ✓ Content in logical reading order
- ✓ State changes announced (e.g., "Button pressed")

### Keyboard Navigation

Tests ensure:
- ✓ All interactive elements reachable via Tab key
- ✓ Logical tab order
- ✓ Enter/Space activate buttons
- ✓ Arrow keys navigate lists and menus
- ✓ Escape closes dialogs

### Visual Accessibility

Tests check:
- ✓ Sufficient color contrast (WCAG AA)
- ✓ Text resizable
- ✓ High contrast mode supported
- ✓ Icons have text alternatives
- ✓ No critical info conveyed by color alone

### Motor Accessibility

Tests verify:
- ✓ Touch targets ≥ 44x44 points
- ✓ Forms support auto-fill
- ✓ No time-sensitive interactions
- ✓ Sufficient spacing between controls
- ✓ Alternative input methods available

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'
      
      - name: Install Maestro
        run: brew install maestro
      
      - name: Start Simulator
        run: xcrun simctl boot "iPhone 14"
      
      - name: Build Flutter App
        run: flutter build ios --simulator
      
      - name: Run E2E Tests
        run: ./maestro/run_e2e_tests.sh --all --video
      
      - name: Upload Test Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-reports
          path: maestro/reports/
      
      - name: Comment PR
        if: always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('maestro/reports/summary.txt', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## E2E Test Results\n\`\`\`\n${report}\n\`\`\``
            });
```

## Troubleshooting

### Maestro Not Found
```bash
# Install Maestro
brew install maestro  # macOS
# Or download from https://maestro.mobile.dev/
```

### Device Connection Issues
```bash
# Check device status
maestro device list

# Restart device
maestro device shutdown
xcrun simctl boot "iPhone 14"
```

### Tests Hang
- Increase timeout values in YAML files
- Check device performance
- Verify app is running: `flutter devices`

### Screen Reader Tests Fail
- Enable accessibility on device:
  - iOS: Settings > Accessibility > VoiceOver
  - Android: Settings > Accessibility > TalkBack

### Form Fills Not Working
- Verify element IDs match app structure
- Check field types (TextField vs other inputs)
- Review app logs for errors

## Best Practices

1. **Maintenance**
   - Update tests when UI changes
   - Version control all test files
   - Document known flakiness
   - Keep element IDs stable

2. **Reliability**
   - Use explicit waits for animations
   - Add retry configuration
   - Test on real devices periodically
   - Monitor test trends

3. **Accessibility**
   - Run all tests with screen reader enabled
   - Test with keyboard navigation only
   - Use high contrast mode
   - Verify at different text sizes

4. **Performance**
   - Monitor test execution time
   - Optimize waits
   - Use device-specific optimizations
   - Run tests in CI/CD

## Resources

- **Maestro Docs**: https://maestro.mobile.dev/
- **Flutter Testing**: https://flutter.dev/docs/testing/integration-tests
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **iOS Accessibility**: https://developer.apple.com/accessibility/ios/
- **Android Accessibility**: https://developer.android.com/guide/topics/ui/accessibility

## Contributing

When adding new E2E tests:

1. Follow existing file naming (##_flow_name.yaml)
2. Include accessibility checks
3. Add descriptive comments
4. Test on both iOS and Android
5. Update this README
6. Document any new patterns

## Support

For issues or questions:
1. Check E2E_TESTING_GUIDE.md for detailed help
2. Review Maestro documentation
3. Check test logs: `maestro logs`
4. Verify app builds: `flutter build`

---

**Last Updated**: February 17, 2026  
**Maestro Version**: 1.35.0+  
**Flutter Version**: 3.x+
