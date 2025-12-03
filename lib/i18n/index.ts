/**
 * Pilar Systems Internationalization (i18n) Module
 * 
 * Provides localization support for German (de) and English (en)
 * to support multilingual self-service workflows.
 */

export { LocaleProvider, useLocale, type Locale } from './locale-provider';
export { translations, getDefaultLocale, interpolate, type TranslationKeys } from './translations';
