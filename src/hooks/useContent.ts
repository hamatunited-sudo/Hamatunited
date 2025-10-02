'use client';

import { useState, useEffect } from 'react';
import contentData from '../../content.json';

// Types for content structure
interface NavItem {
  id: string;
  label: string;
}

export interface ServicePackage {
  name: string;
  description: string;
  price: string;
  sessions?: number;
  link?: string;
  originalPrice?: string;
  discount?: string;
  notes?: string[];
  note?: string;
}

export interface Service {
  title: string;
  description: string;
  features: string[];
  price: string;
  sessions: number;
  duration: string;
  sessionsValue?: number;
  sessionsLabel?: string;
  durationValue?: number;
  durationLabel?: string;
  link?: string;
  note?: string;
  notes?: string[];
  saleEnabled?: boolean;
  salePrice?: string;
  saleOriginalPrice?: string;
  packages?: ServicePackage[];
  isEnterprise?: boolean;
  audience?: 'individuals' | 'enterprise';
  category?: string;
}

interface WhyChooseItem {
  text: string;
  icon: string;
}

interface TestimonialItem {
  text: string;
  name: string;
  title: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface SocialItem {
  name: string;
  url: string;
  icon: string;
}

type TrustedByEntry =
  | string
  | {
      name?: string;
      file?: string;
      path?: string;
      src?: string;
    };

interface CommonEntry {
  logo?: string;
  admin?: string;
  themeLight?: string;
  themeDark?: string;
  language?: string;
  copyright?: string;
}


interface UITestimonialsEntry {
  title?: string;
  subtitle?: string;
}

interface UIAboutEntry {
  sectionTag?: string;
  passionTitle?: string;
  passionSubtitle?: string;
  ctaCardTitle?: string;
  ctaCardSubtitle?: string;
  qualificationsTitle?: string;
  credentialsDescription?: string;
  credentialCountLabel?: string;
}

interface UIStatsEntry {
  eyebrow?: string;
  title?: string;
  description?: string;
}

interface UITrustedByEntry extends UIStatsEntry {
  badge?: string;
  tagline?: string;
  subheading?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

interface UIWhatsAppEntry {
  buttonTitle?: string;
  tooltip?: string;
}

interface UIThemeEntry {
  toggleToLight?: string;
  toggleToDark?: string;
}

interface UIServicesEntry {
  heading?: string;
  subtitle?: string;
  sessionsLabel?: string;
  durationLabel?: string;
  bookButton?: string;
  consultButton?: string;
  eyebrow?: string;
  readMore?: string;
  readLess?: string;
  notesLabel?: string;
  audiencesLabel?: string;
  audienceOptions?: Record<string, string>;
  individualCategoriesLabel?: string;
  individualCategories?: Record<string, string>;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  packagesLabel?: string;
  packagePriceLabel?: string;
  packageSessionsLabel?: string;
}

interface UISocialsEntry {
  cta?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

interface UIFaqEntry {
  title?: string;
  eyebrow?: string;
  description?: string;
}

export interface ContentData {
  header?: {
    ar?: { slogan?: string; nav?: string[]; descriptor?: string };
    en?: { slogan?: string; nav?: string[]; descriptor?: string };
  };
  common?: {
    ar?: CommonEntry;
    en?: CommonEntry;
  };
  navbar: {
    items: NavItem[];
  };
  hero: {
    ar: {
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      ctaPrimaryLink?: string;
      ctaSecondaryLink?: string;
    };
    en: {
      title: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      ctaPrimaryLink?: string;
      ctaSecondaryLink?: string;
    };
  };
  about: {
    ar: {
      heading: string;
      description: string;
      passion?: string;
      qualifications?: string[];
      cta: string;
      ctaLink?: string;
      image: string;
    };
    en: {
      heading: string;
      description: string;
      passion?: string;
      qualifications?: string[];
      cta: string;
      ctaLink?: string;
      image: string;
    };
  };
  stats: {
    ar: {
      sessions: number;
      consultations: number;
      beneficiaries: number;
      years?: number;
      labels: {
        sessions: string;
        consultations: string;
        beneficiaries: string;
        years?: string;
      };
    };
    en: {
      sessions: number;
      consultations: number;
      beneficiaries: number;
      years?: number;
      labels: {
        sessions: string;
        consultations: string;
        beneficiaries: string;
        years?: string;
      };
    };
  };
  services: {
    ar: Service[];
    en: Service[];
  };
  whyChoose: {
    ar: WhyChooseItem[];
    en: WhyChooseItem[];
  };
  testimonials: {
    ar: TestimonialItem[];
    en: TestimonialItem[];
  };
  faq: {
    ar: FAQItem[];
    en: FAQItem[];
  };
  socials: SocialItem[];
  trustedBy?: TrustedByEntry[];
  footer: {
    brand: {
      logoLight: string;
      logoDark: string;
      name: string;
    };
    ar: {
      contactInfo: {
        email: string;
        phone: string;
        address: string;
      };
      quickLinks: string[];
    };
    en: {
      contactInfo: {
        email: string;
        phone: string;
        address: string;
      };
      quickLinks: string[];
    };
    copyright: string;
  };
  whatsapp: {
    phone: string;
    message_ar: string;
    message_en: string;
    urlTemplate: string;
  };
  ui?: {
    services?: Record<string, UIServicesEntry>;
    testimonials?: Record<string, UITestimonialsEntry>;
    socials?: Record<string, UISocialsEntry>;
    faq?: Record<string, UIFaqEntry>;
    about?: Record<string, UIAboutEntry>;
    stats?: Record<string, UIStatsEntry>;
    whyChoose?: Record<string, UIStatsEntry>;
    trustedBy?: Record<string, UITrustedByEntry>;
    whatsapp?: Record<string, UIWhatsAppEntry>;
    theme?: Record<string, UIThemeEntry>;
  };
}

export const useContent = () => {
  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/content');
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          setContent(json as ContentData);
        } else {
          // fallback to bundled content
          setContent(contentData as ContentData);
        }
      } catch {
        // network or other error -> fallback
        setContent(contentData as ContentData);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return {
    content,
    isLoaded
  };
};

export default useContent;
