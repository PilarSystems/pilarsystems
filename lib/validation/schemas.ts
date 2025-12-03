/**
 * Form Validation Schemas for Pilar Systems Self-Service
 * 
 * Comprehensive Zod schemas with localized error messages
 * for zero-touch user signup and onboarding workflows.
 */

import { z } from 'zod';

/**
 * Email validation regex - RFC 5322 compliant
 */
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Phone number validation - international format support
 */
const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/**
 * German/Austrian/Swiss postal code
 */
const postalCodeRegex = /^[0-9]{4,5}$/;

/**
 * URL validation with optional protocol
 */
const urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

/**
 * Signup form schema
 */
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-ZäöüÄÖÜß\s'-]+$/, 'Name contains invalid characters'),
  studioName: z
    .string()
    .min(2, 'Studio name must be at least 2 characters')
    .max(100, 'Studio name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address')
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Onboarding Step 1 - Studio Information
 */
export const onboardingStep1Schema = z.object({
  studioName: z
    .string()
    .min(2, 'Studio name must be at least 2 characters')
    .max(100, 'Studio name must be at most 100 characters'),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be at most 200 characters'),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters'),
  postalCode: z
    .string()
    .min(4, 'Postal code must be at least 4 characters')
    .max(10, 'Postal code must be at most 10 characters')
    .regex(postalCodeRegex, 'Please enter a valid postal code'),
  phone: z
    .string()
    .min(7, 'Phone number must be at least 7 characters')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  website: z
    .string()
    .optional()
    .refine((val) => !val || urlRegex.test(val), {
      message: 'Please enter a valid website URL',
    }),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
});

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;

/**
 * Onboarding Step 2 - Channel Configuration
 */
export const phoneConfigSchema = z.object({
  option: z.enum(['buy', 'own']),
  country: z.enum(['DE', 'AT', 'CH']).optional(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional(),
});

export const whatsappConfigSchema = z.object({
  accessToken: z
    .string()
    .min(10, 'Access token is required')
    .max(500, 'Access token is too long'),
  phoneNumberId: z
    .string()
    .min(10, 'Phone Number ID is required')
    .regex(/^[0-9]+$/, 'Phone Number ID must contain only numbers'),
});

export const emailConfigSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
  provider: z.enum(['gmail', 'outlook', 'custom']),
});

/**
 * Onboarding Step 3 - AI Personality
 */
export const onboardingStep3Schema = z.object({
  voiceId: z
    .string()
    .min(1, 'Please select a voice'),
  tone: z.enum(['professional', 'friendly', 'motivating']),
  targetAudience: z.enum(['premium', 'budget', 'boutique']),
});

export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;

/**
 * Onboarding Step 4 - Automation Rules
 */
export const classificationRulesSchema = z.object({
  aLeadCriteria: z
    .string()
    .min(10, 'Please provide A-lead criteria')
    .max(500, 'Criteria must be at most 500 characters'),
  bLeadCriteria: z
    .string()
    .min(10, 'Please provide B-lead criteria')
    .max(500, 'Criteria must be at most 500 characters'),
  cLeadCriteria: z
    .string()
    .min(10, 'Please provide C-lead criteria')
    .max(500, 'Criteria must be at most 500 characters'),
});

export const followUpSequenceSchema = z.object({
  enabled: z.boolean(),
  timing: z.string(),
  channel: z.enum(['whatsapp', 'email', 'sms']),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be at most 500 characters'),
});

export const automationTriggersSchema = z.object({
  autoReplyWhatsApp: z.boolean(),
  autoReplyEmail: z.boolean(),
  autoClassifyLeads: z.boolean(),
  autoScheduleFollowUps: z.boolean(),
  autoCreateCalendarEvents: z.boolean(),
});

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
});

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirmation schema
 */
export const passwordResetConfirmSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;

/**
 * Account settings schema
 */
export const accountSettingsSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(emailRegex, 'Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: 'Please enter a valid phone number',
    }),
  language: z.enum(['de', 'en']),
  timezone: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }).optional(),
});

export type AccountSettingsData = z.infer<typeof accountSettingsSchema>;

/**
 * Helper function to get validation error messages in the correct locale
 * 
 * Note: English messages are not translated as they are already in English.
 * The English object is intentionally empty as a fallback to the original messages.
 */
export function getLocalizedErrors(
  errors: z.ZodError,
  locale: 'de' | 'en' = 'de'
): Record<string, string> {
  const errorMap: Record<string, string> = {};
  const messages: Record<string, Record<string, string>> = {
    de: {
      'Email is required': 'E-Mail ist erforderlich',
      'Please enter a valid email address': 'Bitte gib eine gültige E-Mail-Adresse ein',
      'Password must be at least 8 characters': 'Passwort muss mindestens 8 Zeichen haben',
      'Passwords do not match': 'Passwörter stimmen nicht überein',
      'Name must be at least 2 characters': 'Name muss mindestens 2 Zeichen haben',
      'Studio name must be at least 2 characters': 'Studio-Name muss mindestens 2 Zeichen haben',
      'Please enter a valid phone number': 'Bitte gib eine gültige Telefonnummer ein',
      'Please enter a valid postal code': 'Bitte gib eine gültige Postleitzahl ein',
      'Please enter a valid website URL': 'Bitte gib eine gültige Webseiten-URL ein',
      'Password is required': 'Passwort ist erforderlich',
      'Please confirm your password': 'Bitte bestätige dein Passwort',
      'Password must contain at least one lowercase letter': 'Passwort muss mindestens einen Kleinbuchstaben enthalten',
      'Password must contain at least one uppercase letter': 'Passwort muss mindestens einen Großbuchstaben enthalten',
      'Password must contain at least one number': 'Passwort muss mindestens eine Zahl enthalten',
      'Please select a voice': 'Bitte wähle eine Stimme aus',
    },
    // English messages are intentionally empty - fallback to original Zod messages which are already in English
    en: {},
  };

  for (const issue of errors.issues) {
    const path = issue.path.join('.');
    const message = issue.message;
    // For English locale, use original message; for German, use translation if available
    errorMap[path] = (locale === 'de' && messages.de[message]) ? messages.de[message] : message;
  }

  return errorMap;
}
