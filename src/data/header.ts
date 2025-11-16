export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  hasDropdown: boolean;
  megaMenuComponent?: string;
}

export interface MegaMenuItem {
  id: string;
  label: string;
  href: string;
  newPage?: boolean;
}

export interface MegaMenuColumn {
  id: string;
  items: MegaMenuItem[];
}

/**
 * 🔹 Haupt-Navigation PILAR SYSTEMS
 * Wird von NavItemLink / Navbar-Komponenten genutzt.
 */
export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/homepage-18',
    hasDropdown: false,
  },
  {
    id: 'features',
    label: 'Funktionen',
    href: '/features-02',
    hasDropdown: false,
  },
  {
    id: 'process',
    label: 'Ablauf',
    href: '/process-01',
    hasDropdown: false,
  },
  {
    id: 'pricing',
    label: 'Preise',
    href: '/homepage-18#pricing',
    hasDropdown: false,
  },
  {
    id: 'customers',
    label: 'Kunden',
    href: '/testimonial-02',
    hasDropdown: false,
  },
  {
    id: 'affiliate',
    label: 'Affiliate',
    href: '/affiliates',
    hasDropdown: false,
  },
  {
    id: 'about',
    label: 'Über uns',
    href: '/about-02',
    hasDropdown: false,
  },
  {
    id: 'login',
    label: 'Login',
    href: '/login-01',
    hasDropdown: false,
  },
];

/**
 * 🔹 About Menu Data – falls irgendwo ein About-Mega- oder Submenu genutzt wird.
 */
export const aboutMenuItems: MegaMenuItem[] = [
  { id: 'about-2', label: 'Über Pilar Systems', href: '/about-02' },
];

/**
 * 🔹 Blog Menu Data
 */
export const blogMenuItems: MegaMenuItem[] = [
  { id: 'blog-1', label: 'Blog Übersicht', href: '/blog-01' },
  { id: 'blog-2', label: 'Blog 02', href: '/blog-02' },
  { id: 'blog-3', label: 'Blog 03', href: '/blog-03' },
  {
    id: 'blog-details',
    label: 'Blog Artikel – Brand Storytelling',
    href: '/blog/5-strategies-for-effective-brand-storytelling',
  },
];

/**
 * 🔹 Services / „Warum Pilar“ – falls ein Services-MegaMenu gebunden ist.
 */
export const servicesMenuItems: MegaMenuItem[] = [
  {
    id: 'services-why',
    label: 'Warum Pilar Systems?',
    href: '/homepage-18#services',
  },
  {
    id: 'services-process',
    label: 'Ablauf & Setup',
    href: '/process-01',
  },
];

/**
 * 🔹 Home Mega Menu Data – auf Pilar fokussiert
 */
export const homeMegaMenuColumns: MegaMenuColumn[] = [
  {
    id: 'column-1',
    items: [
      {
        id: 'home-main',
        label: 'PILAR Home – KI für Fitnessstudios',
        href: '/homepage-18',
      },
    ],
  },
  {
    id: 'column-2',
    items: [
      {
        id: 'home-dashboard-demo',
        label: 'Dashboard Demo',
        href: '/dashboard-demo',
      },
      {
        id: 'home-dashboard',
        label: 'Dashboard (Login benötigt)',
        href: '/dashboard',
      },
    ],
  },
  {
    id: 'column-3',
    items: [
      {
        id: 'home-pricing',
        label: 'Preise & Pläne',
        href: '/homepage-18#pricing',
      },
      {
        id: 'home-affiliate',
        label: 'Affiliate-Programm',
        href: '/affiliates',
      },
    ],
  },
];

/**
 * 🔹 Page Mega Menu Data – gestrafft auf echte PILAR-Seiten
 */
export const pageMegaMenuColumns: MegaMenuColumn[] = [
  {
    id: 'column-1',
    items: [
      { id: 'tutorial', label: 'Produkt-Tour', href: '/tutorial' },
      { id: 'documentation', label: 'Dokumentation', href: '/documentation' },
      { id: 'faq', label: 'FAQ', href: '/faq' },
      { id: 'support', label: 'Support', href: '/support' },
      { id: 'terms', label: 'AGB', href: '/terms-conditions' },
      { id: 'privacy', label: 'Datenschutz', href: '/privacy' },
      { id: 'gdpr', label: 'DSGVO-Infos', href: '/gdpr' },
    ],
  },
  {
    id: 'column-2',
    items: [
      { id: 'features-2', label: 'Funktionen', href: '/features-02' },
      { id: 'integration-1', label: 'Integrationen', href: '/integration-01' },
      { id: 'process-1', label: 'Ablauf & Setup', href: '/process-01' },
      { id: 'analytics', label: 'Analytics', href: '/analytics' },
    ],
  },
  {
    id: 'column-3',
    items: [
      { id: 'testimonial-2', label: 'Kundenstimmen', href: '/testimonial-02' },
      { id: 'case-study', label: 'Case Studies', href: '/case-study' },
      { id: 'team-2', label: 'Über Pilar Systems', href: '/about-02' },
    ],
  },
  {
    id: 'column-4',
    items: [
      { id: 'login-1', label: 'Login', href: '/login-01' },
      { id: 'signup-1', label: 'Account anlegen', href: '/signup-01' },
      { id: 'affiliates', label: 'Affiliate-Programm', href: '/affiliates' },
    ],
  },
];

/**
 * 🔹 Header Brand & CTA Config
 */
export const headerConfig = {
  logo: {
    alt: 'Pilar Systems',
    mainLogoPath: '@public/images/shared/logo.svg',
    logoPath: '@public/images/shared/logo.svg',
    logoDarkPath: '@public/images/shared/logo-dark.svg',
  },
  cta: {
    label: 'Jetzt starten',
    href: '/signup-01',
  },
};
