# Design Document

## Overview

This design outlines the systematic approach for migrating the web application from Next.js 15.5.4 to Next.js 16. The migration involves using the official Next.js 16 codemod for automatic upgrades, followed by manual fixes for any remaining issues. The key breaking changes include async API changes for params, searchParams, cookies, and headers, along with configuration updates and React 19 compatibility.

## Architecture

### Migration Strategy

The migration follows a two-phase approach:

1. **Automated Phase**: Use the official Next.js 16 codemod to handle the majority of breaking changes automatically
2. **Manual Phase**: Address any remaining issues not covered by the codemod

### Key Breaking Changes to Address

Based on Next.js 16 documentation, the main breaking changes are:

1. **Async Request APIs**: `params`, `searchParams`, `cookies()`, `headers()` are now async
2. **Configuration Changes**: Updates to `next.config.mjs` for new features
3. **React 19 Compatibility**: Ensure all dependencies work with React 19
4. **Image Optimization**: Default behavior changes for image optimization
5. **Deprecated API Removal**: Remove usage of deprecated Next.js 15 APIs

## Components and Interfaces

### Migration Components

#### 1. Codemod Execution Component
- **Purpose**: Run the official Next.js 16 codemod
- **Requirements**: Clean git working directory
- **Output**: Automatically upgraded code and dependencies

#### 2. Manual Fix Component  
- **Purpose**: Handle issues not covered by the codemod
- **Scope**: Custom code patterns, configuration edge cases
- **Process**: Systematic review and fix of remaining issues

#### 3. Validation Component
- **Purpose**: Ensure migration success
- **Methods**: Build verification, test execution, runtime validation

### File Categories for Migration

#### Configuration Files
- `next.config.mjs` - Main Next.js configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

#### Application Code
- `app/layout.tsx` - Root layout with potential async API usage
- `app/page.tsx` - Main page component
- `app/parquet-layout/**` - Dynamic route components
- Component files using request APIs

#### Dependencies
- Next.js framework upgrade to v16
- React upgrade to v19 (if not already)
- TypeScript types for Next.js 16
- Third-party packages compatibility check

## Data Models

### Migration State Model

```typescript
interface MigrationState {
  phase: 'preparation' | 'codemod' | 'manual-fixes' | 'validation' | 'complete'
  nextjsVersion: {
    current: string
    target: string
  }
  issues: MigrationIssue[]
  completedSteps: string[]
}

interface MigrationIssue {
  type: 'async-api' | 'config' | 'dependency' | 'deprecated'
  file: string
  description: string
  severity: 'error' | 'warning'
  autoFixable: boolean
}
```

### Async API Migration Pattern

```typescript
// Before (Next.js 15)
export default function Page({ params, searchParams }) {
  const { id } = params
  const { query } = searchParams
  return <div>Content</div>
}

// After (Next.js 16)
export default async function Page({ 
  params, 
  searchParams 
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query?: string }>
}) {
  const { id } = await params
  const { query } = await searchParams
  return <div>Content</div>
}
```

## Error Handling

### Migration Error Categories

1. **Codemod Failures**
   - Dirty git working directory
   - Unsupported code patterns
   - Network issues during package installation

2. **Build Errors**
   - TypeScript compilation errors
   - Missing type definitions
   - Incompatible dependencies

3. **Runtime Errors**
   - Async API usage errors
   - Configuration mismatches
   - Performance regressions

### Error Recovery Strategies

- **Git Reset**: Ability to revert to pre-migration state
- **Incremental Fixes**: Address issues one file at a time
- **Fallback Patterns**: Use compatibility layers where needed
- **Documentation**: Clear error messages with resolution steps

## Testing Strategy

### Pre-Migration Validation
- Ensure clean git working directory
- Verify current build passes
- Run existing test suite
- Document current functionality

### Post-Migration Validation
- Build verification (development and production)
- Test suite execution
- Runtime functionality check
- Performance baseline comparison

### Test Categories

1. **Build Tests**
   - `npm run build` succeeds
   - No TypeScript errors
   - No ESLint errors

2. **Runtime Tests**
   - Development server starts
   - All pages load correctly
   - No console errors
   - Existing functionality works

3. **Integration Tests**
   - Existing Vitest tests pass
   - Component rendering tests
   - Store functionality tests

## Implementation Phases

### Phase 1: Preparation
- Commit or stash current changes
- Backup current state
- Verify Node.js version compatibility
- Document current configuration

### Phase 2: Automated Migration
- Run Next.js 16 codemod
- Review generated changes
- Resolve any codemod conflicts
- Update package-lock.yaml/pnpm-lock.yaml

### Phase 3: Manual Fixes
- Address async API usage in custom code
- Update configuration files
- Fix TypeScript type issues
- Resolve dependency conflicts

### Phase 4: Validation
- Build verification
- Test execution
- Runtime validation
- Performance check

### Phase 5: Documentation
- Document changes made
- Update development setup instructions
- Note any new features available
- Create rollback procedure

## Configuration Updates

### next.config.mjs Updates
- Remove deprecated options
- Add new Next.js 16 features if beneficial
- Update image optimization settings
- Configure new caching options

### Package.json Updates
- Next.js version to 16.x
- React version compatibility
- TypeScript types update
- Dev dependencies alignment

### TypeScript Configuration
- Update for Next.js 16 types
- Ensure React 19 compatibility
- Add any new compiler options

## Risk Mitigation

### High-Risk Areas
- Dynamic routes with params usage
- Components using searchParams
- Server actions with cookies/headers
- Custom middleware or API routes

### Mitigation Strategies
- Incremental migration approach
- Comprehensive testing at each step
- Git-based rollback capability
- Documentation of all changes

### Rollback Plan
- Git reset to pre-migration commit
- Package.json restoration
- Configuration file restoration
- Clear rollback documentation