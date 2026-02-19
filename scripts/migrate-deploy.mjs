#!/usr/bin/env node

import { spawn } from 'node:child_process';

const requiredEnvVars = ['DATABASE_URL'];
const optionalPrismaEnvVars = ['DIRECT_URL', 'SHADOW_DATABASE_URL', 'PRISMA_SCHEMA_PATH', 'PRISMA_QUERY_ENGINE_LIBRARY'];

const missingRequired = requiredEnvVars.filter((key) => !process.env[key]);

console.log('[migrate:deploy] Starting database migration step...');

if (missingRequired.length > 0) {
  console.error(`[migrate:deploy] Missing required environment variables: ${missingRequired.join(', ')}`);
  console.error('[migrate:deploy] Add these in Vercel Project Settings → Environment Variables before deploying.');
  process.exit(1);
}

const presentOptional = optionalPrismaEnvVars.filter((key) => process.env[key]);
if (presentOptional.length > 0) {
  console.log(`[migrate:deploy] Detected optional Prisma environment variables: ${presentOptional.join(', ')}`);
} else {
  console.log('[migrate:deploy] No optional Prisma environment variables detected (this can be fine depending on your Prisma setup).');
}

const migrateProcess = spawn('npx', ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  shell: true,
});

migrateProcess.on('error', (error) => {
  console.error('[migrate:deploy] Failed to execute `npx prisma migrate deploy`.');
  console.error(`[migrate:deploy] ${error.message}`);
  process.exit(1);
});

migrateProcess.on('close', (code) => {
  if (code === 0) {
    console.log('[migrate:deploy] Prisma migrations applied successfully.');
    process.exit(0);
  }

  console.error(`[migrate:deploy] Prisma migrations failed with exit code ${code}.`);
  process.exit(code ?? 1);
});
