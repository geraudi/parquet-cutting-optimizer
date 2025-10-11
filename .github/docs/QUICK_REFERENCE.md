# CI Pipeline Quick Reference

## 🚀 Quick Commands

```bash
# Test everything locally (recommended before pushing)
./.github/scripts/test-workflow.sh

# Individual checks
pnpm lint              # Code quality
pnpm check-types       # TypeScript
pnpm test             # Run tests
pnpm build            # Verify build

# Fix common issues
pnpm lint --fix       # Auto-fix linting
pnpm format           # Format code
```

## 🔧 Troubleshooting Checklist

### ❌ CI Failed? Try this:

1. **Run locally first**:
   ```bash
   ./.github/scripts/test-workflow.sh --local-steps
   ```

2. **Check the specific error** in GitHub Actions logs

3. **Common fixes**:
   ```bash
   # Clear caches
   rm -rf .turbo node_modules/.cache
   pnpm store prune
   
   # Reinstall dependencies
   pnpm install --frozen-lockfile
   
   # Fix linting
   pnpm lint --fix
   pnpm format
   ```

## 📋 Pre-Push Checklist

- [ ] `pnpm lint` passes
- [ ] `pnpm check-types` passes  
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] No console errors/warnings

## 🐳 Full Workflow Testing

```bash
# Install act (one-time setup)
brew install act

# Test complete workflow
./.github/scripts/test-workflow.sh --full-workflow
```

## 📞 Need Help?

1. Check [CI Pipeline Guide](.github/docs/CI_PIPELINE_GUIDE.md)
2. Run failing command locally
3. Check GitHub Actions logs
4. Create an issue with error details