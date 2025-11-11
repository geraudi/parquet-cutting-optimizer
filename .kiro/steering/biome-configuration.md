# Biome Configuration for Kiro IDE

This project uses Biome as the primary formatter and linter, replacing ESLint and Prettier.

## Kiro IDE Integration

The following Kiro settings have been configured to use Biome:

### Formatter Configuration
- **Provider**: Biome (`npx biome format --write`)
- **Format on Save**: Enabled
- **Format on Paste**: Enabled
- **Supported Files**: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.jsonc`

### Linter Configuration
- **Provider**: Biome (`npx biome check`)
- **Lint on Save**: Enabled
- **Inline Warnings**: Enabled
- **Inline Errors**: Enabled
- **Quick Fixes**: Enabled

### Available Commands
- `pnpm format` - Format entire codebase
- `pnpm lint` - Lint entire codebase
- `npx biome check --write .` - Lint and auto-fix issues

### Configuration Files
- **Main Config**: `biome.json` (root level)
- **Kiro Settings**: `.kiro/settings/` directory
  - `kiro.json` - Main IDE configuration
  - `formatter.json` - Formatter-specific settings
  - `languages.json` - Language-specific configurations
  - `workspace.json` - Workspace-specific settings

## Usage in Kiro

1. **Automatic Formatting**: Files will be automatically formatted on save
2. **Inline Diagnostics**: Errors and warnings will appear inline in the editor
3. **Quick Fixes**: Use Kiro's quick fix actions to apply Biome's suggested fixes
4. **Code Actions**: Organize imports and fix all issues via code actions

## Biome Rules

The project follows Biome's recommended rules with custom overrides defined in `biome.json`. Key areas covered:
- Code style and formatting
- Import organization
- Type safety (TypeScript)
- Accessibility (React/JSX)
- Performance optimizations
- Correctness checks

## Troubleshooting

If Biome integration isn't working in Kiro:
1. Ensure `biome.json` exists in the project root
2. Check that Biome is installed: `npx biome --version`
3. Verify Kiro settings in `.kiro/settings/` directory
4. Restart Kiro IDE to reload configuration