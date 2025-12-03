'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLocale, type Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

/**
 * Language Switcher Component
 * 
 * Allows users to switch between available locales (German/English)
 * for multilingual self-service support.
 */
export function LanguageSwitcher({
  variant = 'ghost',
  size = 'sm',
  showLabel = true,
  className = '',
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="ml-2">
              {currentLanguage.flag} {currentLanguage.label}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLocale(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
