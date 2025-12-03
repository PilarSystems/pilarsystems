#!/usr/bin/env node
/**
 * Build Verification Script
 * Ensures zero-touch deployment readiness
 */

import { execSync } from 'child_process';

interface Check {
  name: string;
  cmd: string;
}

const checks: Check[] = [
  { name: 'Dependencies', cmd: 'yarn install --frozen-lockfile' },
  { name: 'Prisma Generate', cmd: 'npx prisma generate' },
  { name: 'TypeScript Check', cmd: 'npx tsc --noEmit' },
  { name: 'Lint', cmd: 'yarn lint' },
  { name: 'Build', cmd: 'yarn build' },
];

let failed = false;

console.log('🚀 PILAR SYSTEMS Build Verification\n');
console.log('='.repeat(50));

for (const check of checks) {
  console.log(`\n🔍 Running: ${check.name}`);
  console.log('-'.repeat(30));
  try {
    execSync(check.cmd, { stdio: 'inherit' });
    console.log(`✅ ${check.name} passed`);
  } catch {
    console.error(`❌ ${check.name} failed`);
    failed = true;
    break;
  }
}

console.log('\n' + '='.repeat(50));

if (failed) {
  console.error('\n❌ Build verification failed');
  console.error('Please fix the errors above before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Ready for deployment.');
  process.exit(0);
}
