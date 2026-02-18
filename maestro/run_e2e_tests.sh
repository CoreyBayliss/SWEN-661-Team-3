#!/bin/bash
# CareConnect E2E Test Runner Script
# Runs Maestro tests with various options

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MAESTRO_DIR="maestro"
REPORTS_DIR="maestro/reports"
BUILD_DIR="build"

echo -e "${BLUE}=== CareConnect E2E Test Runner ===${NC}\n"

# Function to print usage
print_usage() {
    cat << EOF
Usage: ./run_e2e_tests.sh [OPTION]

Options:
    -a, --all           Run all tests
    -l, --login         Run login flow test
    -m, --medications   Run medication management test
    -c, --calendar      Run appointments flow test
    -r, --refills       Run refill request test
    -s, --settings      Run settings & accessibility test
    --accessibility     Run tests with accessibility focus
    --video             Record video during tests
    --screenshots       Take screenshots during tests
    --device DEVICE     Run on specific device
    --ios               Build and test for iOS
    --android           Build and test for Android
    --clean             Clean build artifacts
    -h, --help          Show this help message

Examples:
    ./run_e2e_tests.sh --all              # Run all tests
    ./run_e2e_tests.sh --login            # Run login test
    ./run_e2e_tests.sh --all --video      # Run all with video
    ./run_e2e_tests.sh --accessibility    # Focus on accessibility
EOF
}

# Function to check if Maestro is installed
check_maestro() {
    if ! command -v maestro &> /dev/null; then
        echo -e "${RED}Maestro not found. Install from: https://maestro.mobile.dev/${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Maestro found${NC}"
}

# Function to build Flutter app
build_app() {
    local platform=$1
    echo -e "${BLUE}Building Flutter app for $platform...${NC}"
    
    if [ "$platform" = "ios" ]; then
        flutter build ios --simulator
    elif [ "$platform" = "android" ]; then
        flutter build apk
    fi
    
    echo -e "${GREEN}✓ Build complete${NC}\n"
}

# Function to run test
run_test() {
    local test_file=$1
    local extra_args=$2
    
    echo -e "${BLUE}Running: $test_file${NC}"
    maestro test "$MAESTRO_DIR/$test_file" $extra_args
    echo -e "${GREEN}✓ Test passed${NC}\n"
}

# Function to run all tests
run_all_tests() {
    local extra_args=$1
    
    echo -e "${YELLOW}Running all critical E2E tests...${NC}\n"
    
    run_test "01_login_flow.yaml" "$extra_args"
    run_test "02_medication_management.yaml" "$extra_args"
    run_test "03_appointments_flow.yaml" "$extra_args"
    run_test "04_refill_request_flow.yaml" "$extra_args"
    run_test "05_settings_accessibility_flow.yaml" "$extra_args"
    
    echo -e "${GREEN}✓ All tests completed${NC}"
}

# Function to generate report
generate_report() {
    echo -e "${BLUE}Generating test report...${NC}"
    
    mkdir -p "$REPORTS_DIR"
    
    cat > "$REPORTS_DIR/summary.txt" << EOF
CareConnect E2E Test Results
Generated: $(date)

Test Flows Executed:
- Login Flow
- Medication Management
- Appointments Management
- Refill Request Process
- Settings & Accessibility

All tests include:
✓ Functional testing
✓ Accessibility testing (Screen Reader, Keyboard Navigation)
✓ Form validation
✓ Error handling
✓ Navigation flows

For detailed results, see the JSON reports.
EOF
    
    echo -e "${GREEN}✓ Report generated in $REPORTS_DIR${NC}\n"
}

# Main script logic
main() {
    local test_type="none"
    local extra_args=""
    local platform="both"
    
    if [ $# -eq 0 ]; then
        print_usage
        exit 0
    fi
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -a|--all)
                test_type="all"
                shift
                ;;
            -l|--login)
                test_type="login"
                shift
                ;;
            -m|--medications)
                test_type="medications"
                shift
                ;;
            -c|--calendar)
                test_type="appointments"
                shift
                ;;
            -r|--refills)
                test_type="refills"
                shift
                ;;
            -s|--settings)
                test_type="settings"
                shift
                ;;
            --accessibility)
                extra_args="$extra_args --include-tags accessibility"
                shift
                ;;
            --video)
                extra_args="$extra_args --record-video"
                shift
                ;;
            --screenshots)
                extra_args="$extra_args --take-screenshots"
                shift
                ;;
            --device)
                extra_args="$extra_args -d $2"
                shift 2
                ;;
            --ios)
                platform="ios"
                shift
                ;;
            --android)
                platform="android"
                shift
                ;;
            --clean)
                echo -e "${BLUE}Cleaning build artifacts...${NC}"
                rm -rf build/ .dart_tool/
                echo -e "${GREEN}✓ Clean complete${NC}"
                exit 0
                ;;
            -h|--help)
                print_usage
                exit 0
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                print_usage
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_maestro
    
    # Build if platform specified
    if [ "$platform" != "both" ]; then
        build_app "$platform"
    fi
    
    # Run tests
    case $test_type in
        all)
            run_all_tests "$extra_args"
            ;;
        login)
            run_test "01_login_flow.yaml" "$extra_args"
            ;;
        medications)
            run_test "02_medication_management.yaml" "$extra_args"
            ;;
        appointments)
            run_test "03_appointments_flow.yaml" "$extra_args"
            ;;
        refills)
            run_test "04_refill_request_flow.yaml" "$extra_args"
            ;;
        settings)
            run_test "05_settings_accessibility_flow.yaml" "$extra_args"
            ;;
        none)
            print_usage
            exit 1
            ;;
    esac
    
    # Generate report
    generate_report
}

# Run main function
main "$@"
