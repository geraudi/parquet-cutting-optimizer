# CI Pipeline Usage and Troubleshooting Guide

## Overview

This document provides comprehensive guidance on using and troubleshooting the GitHub Actions CI pipeline for this monorepo project.

## Pipeline Overview

The CI pipeline (`ci.yml`) runs automatically on:
- Push to `main` or `develop` branches
- Pull requests targeting `main` or `develop` branches

### Pipeline Steps

1. **Setup Environment**
   - Checkout repository
   - Setup Node.js 20.x
   - Setup pnpm package manager
   - Configure caching for dependencies and build artifacts

2. **Install Dependencies**
   - Install all workspace dependencies using `pnpm install --frozen-lockfile`

3. **Code Quality Checks**
   - ESLint analysis (`pnpm lint`)
   - TypeScript type checking (`pnpm check-types`)

4. **Testing**
   - Run complete test suite (`pnpm test`)

5. **Build Verification**
   - Verify project builds successfully (`pnpm build`)

## Local Testing

### Quick Local Testing (Recommended)

Run the same commands locally to catch issues before pushing:

```bash
# Install dependencies
pnpm install

# Run all CI checks locally
pnpm lint          # ESLint checks
pnpm check-types   # TypeScript type checking
pnpm test          # Run tests
pnpm build         # Verify build

# Or run all at once using our test script
./.github/scripts/test-workflow.sh --local-steps
```

### Full Workflow Testing with act

For complete workflow simulation using Docker:

1. **Install act** (GitHub Actions local runner):
   ```bash
   # macOS/Linux with Homebrew
   brew install act
   
   # Or use the installation script
   curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
   ```

2. **Run the workflow locally**:
   ```bash
   # Using our test script (recommended)
   ./.github/scripts/test-workflow.sh --full-workflow
   
   # Or run act directly
   act -j ci --verbose
   ```

### Test Script Usage

The `.github/scripts/test-workflow.sh` script provides several options:

```bash
# Run CI steps locally (no Docker required)
./github/scripts/test-workflow.sh --local-steps

# Run full workflow with act (requires Docker)
./github/scripts/test-workflow.sh --full-workflow

# Validate workflow syntax
./github/scripts/test-workflow.sh --validate

# Show act installation instructions
./github/scripts/test-workflow.sh --install-act

# Show help
./github/scripts/test-workflow.sh --help
```

## Troubleshooting Common Issues

### 1. Linting Failures

**Symptoms**: ESLint step fails with code quality issues

**Solutions**:
```bash
# Run linting locally to see detailed errors
pnpm lint

# Auto-fix many linting issues
pnpm lint --fix

# Check specific files
pnpm eslint path/to/file.ts
```

**Common causes**:
- Unused imports or variables
- Inconsistent code formatting
- Missing semicolons or trailing commas
- Accessibility issues in React components

### 2. TypeScript Type Errors

**Symptoms**: Type checking step fails

**Solutions**:
```bash
# Run type checking locally
pnpm check-types

# Check types in specific workspace
pnpm --filter @workspace/ui check-types

# Use TypeScript compiler directly for detailed output
npx tsc --noEmit --pretty
```

**Common causes**:
- Missing type definitions
- Incorrect prop types in React components
- Import/export type mismatches
- Missing dependencies in package.json

### 3. Test Failures

**Symptoms**: Test suite fails

**Solutions**:
```bash
# Run tests locally with verbose output
pnpm test --verbose

# Run tests in specific workspace
pnpm --filter @workspace/ui test

# Run tests in watch mode for development
pnpm test --watch

# Run specific test file
pnpm test path/to/test.spec.ts
```

**Common causes**:
- Broken component functionality
- Missing test dependencies
- Environment-specific test failures
- Outdated snapshots

### 4. Build Failures

**Symptoms**: Build step fails

**Solutions**:
```bash
# Run build locally
pnpm build

# Build specific workspace
pnpm --filter @workspace/ui build

# Clean build cache and retry
rm -rf .turbo node_modules/.cache
pnpm install
pnpm build
```

**Common causes**:
- Missing dependencies
- TypeScript compilation errors
- Build configuration issues
- Circular dependencies

### 5. Dependency Installation Issues

**Symptoms**: `pnpm install` fails

**Solutions**:
```bash
# Clear pnpm cache
pnpm store prune

# Remove lock file and reinstall (use with caution)
rm pnpm-lock.yaml
pnpm install

# Check for conflicting peer dependencies
pnpm install --reporter=append-only
```

**Common causes**:
- Corrupted lock file
- Network connectivity issues
- Incompatible dependency versions
- Missing system dependencies

### 6. Cache-Related Issues

**Symptoms**: Inconsistent behavior between local and CI

**Solutions**:
```bash
# Clear all caches
rm -rf .turbo node_modules/.cache
pnpm store prune

# Force fresh installation
pnpm install --frozen-lockfile --force
```

## Performance Optimization

### Caching Strategy

The pipeline uses multiple caching layers:

1. **pnpm store cache**: Speeds up dependency installation
2. **node_modules cache**: Avoids reinstalling unchanged dependencies
3. **Turbo build cache**: Speeds up builds and tests

### Monitoring Build Times

- Check the "Actions" tab in GitHub for build duration
- Look for steps that take unusually long
- Consider splitting large workspaces if builds become slow

## Best Practices

### Before Pushing Code

1. **Run local checks**:
   ```bash
   ./.github/scripts/test-workflow.sh --local-steps
   ```

2. **Fix issues locally** before pushing to avoid CI failures

3. **Keep commits focused** to make CI failures easier to debug

### Writing CI-Friendly Code

1. **Ensure tests are deterministic** and don't rely on external services
2. **Use proper TypeScript types** to catch errors early
3. **Follow linting rules** consistently
4. **Keep build outputs small** and efficient

### Debugging CI Failures

1. **Check the specific step** that failed in the GitHub Actions log
2. **Reproduce locally** using the same commands
3. **Check for environment differences** between local and CI
4. **Look at the full error output**, not just the summary

## Environment Variables

The CI pipeline uses these environment variables:

- `TURBO_CACHE_DIR`: Set to `.turbo` for local caching
- `NODE_ENV`: Automatically set by GitHub Actions
- `CI`: Automatically set to `true` in CI environment

## Security Considerations

- **Secrets**: Never commit sensitive data; use GitHub Secrets for API keys
- **Dependencies**: Regularly update dependencies to patch security vulnerabilities
- **Permissions**: The workflow uses minimal required permissions

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the GitHub Actions logs** for detailed error messages
2. **Run the failing command locally** to reproduce the issue
3. **Search existing issues** in the repository
4. **Create a new issue** with:
   - The failing step
   - Complete error output
   - Steps to reproduce locally
   - Your environment details (OS, Node version, etc.)

## Workflow Configuration

The main workflow file is located at `.github/workflows/ci.yml`. Key configuration points:

- **Node.js version**: Currently set to 20.x
- **pnpm version**: Currently set to 10.18.2
- **Trigger branches**: `main` and `develop`
- **Runner**: `ubuntu-latest`

To modify the workflow, edit the YAML file and test changes using act before pushing.