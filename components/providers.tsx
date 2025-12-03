'use client';

import React, { type ReactNode } from 'react';
import { LocaleProvider } from '@/lib/i18n';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Client-side providers wrapper
 * 
 * Wraps the application with necessary providers:
 * - LocaleProvider for i18n
 * - ErrorBoundary for error handling
 * - Toaster for notifications
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        {children}
        <Toaster richColors position="top-right" />
      </LocaleProvider>
    </ErrorBoundary>
  );
}

export default Providers;
