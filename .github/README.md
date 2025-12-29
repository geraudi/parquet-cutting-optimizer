# GitHub Actions CI/CD Setup

This directory contains the GitHub Actions workflows and related tooling for continuous integration and deployment.

## 📁 Structure

```
.github/
├── workflows/
│   └── ci.yml                    # Main CI pipeline
├── scripts/
│   └── test-workflow.sh          # Local workflow testing script
├── docs/
│   ├── CI_PIPELINE_GUIDE.md      # Comprehensive CI guide
│   └── QUICK_REFERENCE.md        # Quick reference for developers
└── README.md                     # This file
```

## 🚀 Quick Start

### Test CI Pipeline Locally

```bash
# Run all CI checks locally (recommended)
pnpm ci:test

# Or use the script directly
./.github/scripts/test-workflow.sh --local-steps
```

### Full Workflow Simulation

```bash
# Install act (one-time setup)
brew install act

# Run complete workflow with Docker
./.github/scripts/test-workflow.sh --full-workflow
```

## 📚 Documentation

- **[CI Pipeline Guide](docs/CI_PIPELINE_GUIDE.md)** - Comprehensive usage and troubleshooting guide
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Essential commands and checklist

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm ci:test` | Run CI checks locally |
| `pnpm ci:validate` | Validate workflow syntax |
| `./.github/scripts/test-workflow.sh --help` | Show all testing options |

## 🎯 CI Pipeline Features

- **Automated Quality Checks**: ESLint, TypeScript, and testing
- **Smart Caching**: Dependencies, builds, and turbo cache
- **Detailed Logging**: Clear error messages and troubleshooting tips
- **Local Testing**: Run the same checks locally before pushing
- **Monorepo Support**: Optimized for turbo-powered monorepos

## 🛠️ Workflow Configuration

The main CI workflow (`.github/workflows/ci.yml`) includes:

- **Triggers**: Push to `main`/`develop`, PRs to `main`/`develop`
- **Environment**: Ubuntu Latest, Node.js 20.x, pnpm 10.26.2
- **Steps**: Lint → Type Check → Test → Build
- **Caching**: Multi-layer caching for optimal performance

## 🔍 Troubleshooting

1. **CI failed?** Check the [troubleshooting guide](docs/CI_PIPELINE_GUIDE.md#troubleshooting-common-issues)
2. **Need help?** See the [quick reference](docs/QUICK_REFERENCE.md)
3. **Local testing** Use `pnpm ci:test` to reproduce issues locally

## 🤝 Contributing

When contributing to the CI setup:

1. Test changes locally using act
2. Update documentation if needed
3. Ensure backward compatibility
4. Follow the existing patterns and conventions