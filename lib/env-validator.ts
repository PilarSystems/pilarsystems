/**
 * Environment Variable Validator
 * Validates required ENV vars at build time to prevent runtime failures
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'OPENAI_API_KEY',
  'ENCRYPTION_KEY',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

const optionalEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'WHATSAPP_API_TOKEN',
  'ELEVENLABS_API_KEY',
  'GOOGLE_CLIENT_ID',
  'RATE_LIMIT_REDIS_URL',
];

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  optional: string[];
}

/**
 * Validates environment variables and returns the result
 */
export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];
  const optional: string[] = [];

  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  for (const key of optionalEnvVars) {
    if (!process.env[key]) {
      optional.push(key);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    optional,
  };
}

/**
 * Validates environment variables and throws if required vars are missing
 */
export function validateEnvOrThrow(): void {
  const result = validateEnv();

  if (!result.valid) {
    console.error('❌ Missing required environment variables:');
    result.missing.forEach(key => console.error(`   - ${key}`));
    throw new Error('Missing required environment variables');
  }

  if (result.optional.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  Missing optional environment variables:');
    result.optional.forEach(key => console.warn(`   - ${key}`));
    console.warn('Some features may be disabled.');
  }

  console.log('✅ Environment variables validated');
}

/**
 * Helper to check if we're in a build context where env validation should be skipped
 */
export function shouldSkipEnvValidation(): boolean {
  // Skip during build if explicitly set
  if (process.env.SKIP_ENV_VALIDATION === 'true') {
    return true;
  }
  // Skip in test environment
  if (process.env.NODE_ENV === 'test') {
    return true;
  }
  return false;
}
