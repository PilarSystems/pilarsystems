#!/bin/bash
# Preflight checks to prevent build issues

set -e

echo "🔍 Running preflight checks..."

# Check 1: toast.* without import
echo "Checking for toast usage without imports..."
TOAST_ISSUES=""
for f in $(find app -name "*.tsx" -type f); do
  if grep -q "toast\." "$f" && ! grep -q "from ['\"]sonner['\"]" "$f"; then
    TOAST_ISSUES="$TOAST_ISSUES\n$f"
  fi
done

if [ -n "$TOAST_ISSUES" ]; then
  echo "❌ ERROR: Files using toast without importing from sonner:"
  echo -e "$TOAST_ISSUES"
  exit 1
fi

# Check 2: toast in server files
echo "Checking for toast in server files..."
SERVER_TOAST=$(find app -name "route.ts" -o -name "layout.ts" | xargs grep -l "toast\." 2>/dev/null || true)
if [ -n "$SERVER_TOAST" ]; then
  echo "❌ ERROR: toast used in server files:"
  echo "$SERVER_TOAST"
  exit 1
fi

# Check 3: console.* in production paths (excluding dev/test files)
echo "Checking for console statements in production code..."
CONSOLE_ISSUES=$(find app lib -name "*.ts" -o -name "*.tsx" | grep -v ".test." | grep -v ".spec." | xargs grep -l "console\.\(log\|error\|warn\|debug\)" 2>/dev/null || true)
if [ -n "$CONSOLE_ISSUES" ]; then
  echo "⚠️  WARNING: console statements found in:"
  echo "$CONSOLE_ISSUES"
  echo "(These should use logger instead)"
fi

echo "✅ Preflight checks passed!"
