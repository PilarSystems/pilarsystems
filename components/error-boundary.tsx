'use client';

import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  locale?: 'de' | 'en';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Translations for error boundary
const errorTranslations = {
  de: {
    title: 'Etwas ist schiefgelaufen',
    description: 'Ein unerwarteter Fehler ist aufgetreten. Keine Sorge, deine Daten sind sicher.',
    retry: 'Erneut versuchen',
    home: 'Zur Startseite',
    contact: 'Support kontaktieren',
    fallbackTitle: 'Etwas ist schiefgelaufen',
    fallbackDescription: 'Bitte versuche es erneut.',
  },
  en: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Don\'t worry, your data is safe.',
    retry: 'Try again',
    home: 'Go to home',
    contact: 'Contact support',
    fallbackTitle: 'Something went wrong',
    fallbackDescription: 'Please try again.',
  },
};

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * the entire application.
 * 
 * Part of Phase C: Reinforcing error handling mechanisms to shield
 * user workflows from unexpected interruptions.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log to console for development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry)
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  getLocale(): 'de' | 'en' {
    // Try to get locale from props, then localStorage, then browser, then default to 'de'
    if (this.props.locale) {
      return this.props.locale;
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pilar-locale');
      if (stored === 'de' || stored === 'en') {
        return stored;
      }
      if (navigator.language.toLowerCase().startsWith('en')) {
        return 'en';
      }
    }
    return 'de';
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const locale = this.getLocale();
      const t = errorTranslations[locale];

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">{t.title}</CardTitle>
              <CardDescription>
                {t.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-32">
                  <p className="text-red-600 dark:text-red-400 font-semibold">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full" variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t.retry}
                </Button>
                <Button onClick={this.handleGoHome} className="w-full" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  {t.home}
                </Button>
                <Button 
                  onClick={() => window.location.href = 'mailto:support@pilarsystems.de'}
                  className="w-full" 
                  variant="ghost"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {t.contact}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
  locale?: 'de' | 'en';
}

/**
 * Error Fallback Component for lighter error states
 */
export function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  title,
  description,
  locale: providedLocale,
}: ErrorFallbackProps) {
  // Determine locale
  let locale: 'de' | 'en' = 'de';
  if (providedLocale) {
    locale = providedLocale;
  } else if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pilar-locale');
    if (stored === 'de' || stored === 'en') {
      locale = stored;
    } else if (navigator.language.toLowerCase().startsWith('en')) {
      locale = 'en';
    }
  }
  
  const t = errorTranslations[locale];
  const displayTitle = title || t.fallbackTitle;
  const displayDescription = description || t.fallbackDescription;
  
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {displayTitle}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {displayDescription}
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <p className="text-xs text-red-500 mb-4 font-mono">
          {error.message}
        </p>
      )}
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t.retry}
        </Button>
      )}
    </div>
  );
}

/**
 * Async Error Boundary wrapper for data fetching components
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.ComponentType<P> {
  const ComponentWithErrorBoundary = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
