#!/bin/bash

# Test CI Pipeline Locally
# This script runs the same commands as your GitHub Actions CI

set -e  # Exit on any error

echo "🚀 Testing CI Pipeline Locally"
echo "================================"

echo ""
echo "📥 Step 1: Installing dependencies..."
pnpm install --frozen-lockfile

echo ""
echo "🔍 Step 2: Running linting..."
if pnpm lint; then
    echo "✅ Linting passed"
else
    echo "❌ Linting failed - fix issues before pushing"
    exit 1
fi

echo ""
echo "🔍 Step 3: Running TypeScript type checking..."
if pnpm check-types; then
    echo "✅ Type checking passed"
else
    echo "❌ Type checking failed - fix type errors before pushing"
    exit 1
fi

echo ""
echo "🧪 Step 4: Running tests..."
if pnpm test; then
    echo "✅ Tests passed"
else
    echo "❌ Tests failed - fix failing tests before pushing"
    exit 1
fi

echo ""
echo "🏗️ Step 5: Building project..."
if pnpm build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - fix build errors before pushing"
    exit 1
fi

echo ""
echo "🎉 All CI checks passed! Ready to push."