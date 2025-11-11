# Design Document

## Overview

This design outlines the migration strategy from ESLint and Prettier to Biome in a Turbo monorepo. The migration will replace the existing linting and formatting infrastructure with Biome's unified toolchain while maintaining equivalent code quality standards and development workflow.

## Architecture

### Current State
- **Root Level**: ESLint config (.eslintrc.js), Prettier dependency, Turbo orchestration
- **ESLint Config Package**: Shared ESLint configurations for base, Next.js, and React
- **Web App**: Uses ESLint config via eslint.config.mjs, has lint/format scripts
- **UI Package**: Uses ESLint config, has lint/format scripts
- **Build Pipeline**: Turbo tasks for lint, format, and type checking

### Target State
- **Root Level**: Biome configuration (biome.json), Biome dependency, updated Turbo tasks
- **ESLint Config Package**: Removed entirely
- **Web App**: Direct Biome usage, updated scripts
- **UI Package**: Direct Biome usage, updated scripts
- **Build Pipeline**: Turbo tasks using Biome commands

## Components and Interfaces

### Biome Configuration
```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**", "!node_modules", "!.next", "!dist", "!build"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    },
    "domains": {
      "next": "recommended",
      "react": "recommended"
    }
  },
  "assist": {
    "actions": {
      "source": {
        "organizeImports": "on"
      }
    }
  }
}
```

### Package Dependencies
- **Add**: `@biomejs/biome` as devDependency to root package.json
- **Remove**: `prettier`, `@workspace/eslint-config` from root
- **Remove**: ESLint-related dependencies from individual packages

### Script Updates
- **Root**: `"format": "biome format --write ."`, `"lint": "biome check ."`
- **Apps/Web**: `"lint": "biome check ."`, `"format": "biome format --write ."`
- **Packages/UI**: `"lint": "biome check ."`, `"format": "biome format --write ."`

## Data Models

### Configuration Mapping
| Current ESLint Rule | Biome Equivalent | Notes |
|-------------------|------------------|-------|
| @typescript-eslint/recommended | TypeScript domain rules | Built into Biome |
| react/recommended | React domain rules | Built into Biome |
| @next/next/recommended | Next.js domain rules | Built into Biome |
| prettier integration | Formatter configuration | Unified in Biome |
| import organization | organizeImports: "on" | Biome assist feature |

### File Structure Changes
```
Before:
├── .eslintrc.js
├── packages/eslint-config/
│   ├── base.js
│   ├── next.js
│   └── react-internal.js
├── apps/web/eslint.config.mjs
└── packages/ui/eslint.config.js

After:
├── biome.json
└── (eslint files removed)
```

## Error Handling

### Migration Validation
1. **Syntax Validation**: Run Biome check on all files to ensure no syntax errors
2. **Rule Compatibility**: Verify that Biome's recommended rules catch similar issues as current ESLint setup
3. **Format Consistency**: Ensure Biome formatting produces consistent results across the codebase
4. **Build Integration**: Validate that Turbo tasks execute successfully with Biome commands

### Rollback Strategy
- Keep backup of removed files during migration
- Document exact dependency versions for potential rollback
- Test migration on a branch before merging to main

### Common Issues and Solutions
- **Import Organization**: Biome's import organization may differ from ESLint - validate and adjust if needed
- **Rule Strictness**: Some Biome rules may be stricter/looser than ESLint equivalents - review and configure
- **File Extensions**: Ensure Biome processes all relevant file types (.ts, .tsx, .js, .jsx, .json)

## Testing Strategy

### Pre-Migration Testing
1. Run current ESLint and Prettier on codebase to establish baseline
2. Document any existing linting warnings/errors
3. Capture current formatting output for comparison

### Post-Migration Testing
1. **Linting Verification**: Run `biome check .` and verify no new errors introduced
2. **Formatting Verification**: Run `biome format --write .` and verify consistent formatting
3. **Build Pipeline**: Execute full Turbo pipeline (`pnpm lint`, `pnpm format`, `pnpm build`)
4. **Import Organization**: Test import organization on sample files
5. **IDE Integration**: Verify Biome works with development environment

### Acceptance Testing
1. All Turbo tasks complete successfully
2. Code formatting remains consistent with project standards
3. No new linting errors introduced beyond existing baseline
4. Import organization functions correctly
5. Development workflow remains smooth

## Implementation Phases

### Phase 1: Setup and Configuration
- Install Biome dependency
- Create biome.json configuration
- Update root package.json scripts

### Phase 2: Package Updates
- Update apps/web package.json and remove ESLint config
- Update packages/ui package.json and remove ESLint config
- Update Turbo configuration for new commands

### Phase 3: Cleanup
- Remove ESLint configuration files
- Remove packages/eslint-config directory
- Clean up dependencies

### Phase 4: Validation
- Run comprehensive testing
- Verify build pipeline
- Validate development workflow