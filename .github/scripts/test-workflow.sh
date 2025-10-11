#!/bin/bash

# GitHub Actions Workflow Local Testing Script
# This script provides utilities for testing the CI workflow locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if act is installed
check_act_installation() {
    if ! command -v act &> /dev/null; then
        print_error "act is not installed. Please install it first:"
        echo ""
        echo "  # Using Homebrew (macOS/Linux):"
        echo "  brew install act"
        echo ""
        echo "  # Using GitHub releases:"
        echo "  curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash"
        echo ""
        echo "  # For more installation options, visit: https://github.com/nektos/act"
        exit 1
    fi
}

# Function to run the full CI workflow locally
run_full_workflow() {
    print_status "Running full CI workflow locally using act..."
    
    # Create .actrc file if it doesn't exist
    if [ ! -f .actrc ]; then
        print_status "Creating .actrc configuration file..."
        cat > .actrc << EOF
# act configuration for local GitHub Actions testing
--container-architecture linux/amd64
--platform ubuntu-latest=catthehacker/ubuntu:act-latest
EOF
    fi
    
    # Run the workflow
    act -j ci --verbose
}

# Function to run individual CI steps locally (without act)
run_local_ci_steps() {
    print_status "Running CI steps locally (without containers)..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    print_status "Step 1: Installing dependencies..."
    if pnpm install --frozen-lockfile; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    print_status "Step 2: Running ESLint..."
    if pnpm lint; then
        print_success "Linting passed"
    else
        print_error "Linting failed"
        exit 1
    fi
    
    print_status "Step 3: Running TypeScript type checking..."
    if pnpm check-types; then
        print_success "Type checking passed"
    else
        print_error "Type checking failed"
        exit 1
    fi
    
    print_status "Step 4: Running tests..."
    if pnpm test; then
        print_success "Tests passed"
    else
        print_error "Tests failed"
        exit 1
    fi
    
    print_status "Step 5: Building project..."
    if pnpm build; then
        print_success "Build successful"
    else
        print_error "Build failed"
        exit 1
    fi
    
    print_success "All CI steps completed successfully! 🎉"
}

# Function to validate workflow syntax
validate_workflow() {
    print_status "Validating GitHub Actions workflow syntax..."
    
    if command -v act &> /dev/null; then
        act --list
        print_success "Workflow syntax is valid"
    else
        print_warning "act not installed - skipping workflow syntax validation"
        print_status "You can install act to validate workflow syntax"
    fi
}

# Function to show help
show_help() {
    echo "GitHub Actions Workflow Testing Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --full-workflow    Run the complete CI workflow using act (requires Docker)"
    echo "  --local-steps      Run CI steps locally without containers"
    echo "  --validate         Validate workflow syntax"
    echo "  --install-act      Show instructions for installing act"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --local-steps   # Quick local testing without Docker"
    echo "  $0 --full-workflow # Full workflow simulation with act"
    echo "  $0 --validate      # Check workflow syntax"
}

# Function to show act installation instructions
show_act_installation() {
    echo "Installing act (GitHub Actions local runner)"
    echo ""
    echo "act allows you to run GitHub Actions workflows locally using Docker."
    echo ""
    echo "Installation options:"
    echo ""
    echo "1. Using Homebrew (macOS/Linux):"
    echo "   brew install act"
    echo ""
    echo "2. Using GitHub releases (Linux/macOS):"
    echo "   curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash"
    echo ""
    echo "3. Using Chocolatey (Windows):"
    echo "   choco install act-cli"
    echo ""
    echo "4. Using Scoop (Windows):"
    echo "   scoop install act"
    echo ""
    echo "Requirements:"
    echo "- Docker must be installed and running"
    echo "- Sufficient disk space for Docker images (~2GB)"
    echo ""
    echo "For more information, visit: https://github.com/nektos/act"
}

# Main script logic
case "${1:-}" in
    --full-workflow)
        check_act_installation
        run_full_workflow
        ;;
    --local-steps)
        run_local_ci_steps
        ;;
    --validate)
        validate_workflow
        ;;
    --install-act)
        show_act_installation
        ;;
    --help)
        show_help
        ;;
    "")
        print_status "No option specified. Running local CI steps..."
        run_local_ci_steps
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac