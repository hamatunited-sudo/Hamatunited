import type { ReactNode } from 'react';

// Recursive localized value to support nested objects/arrays in content.json
export type LocalizedValue =
  | string
  | number
  | boolean
  | ReactNode
  | null
  | undefined
  | { [key: string]: LocalizedValue }
  | LocalizedValue[];

export interface LocalizedStrings {
  [key: string]: LocalizedValue;
}

export interface UIGroup {
  ar?: LocalizedStrings;
  en?: LocalizedStrings;
}

export interface WhatsAppConfig {
  phone?: string;
  message_ar?: string;
  message_en?: string;
  urlTemplate?: string;
}

export interface ContentData {
  // Top-level localized content
  ar: LocalizedStrings;
  en: LocalizedStrings;

  // Optional UI groups (e.g., ui.whatsapp, ui.faq)
  ui?: Record<string, UIGroup>;

  // Optional whatsapp config at top level
  whatsapp?: WhatsAppConfig;

  // Optional FAQ entries grouped by language
  faq?: {
    ar?: Array<{ question: string; answer: string }>;
    en?: Array<{ question: string; answer: string }>;
    [key: string]: unknown;
  };

  // Optional footer and common branding
  footer?: {
    brand?: {
      name?: string;
      logo?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  // Common localized resources (e.g., common.ar.logo)
  common?: {
    [lang: string]: {
      logo?: string;
      [key: string]: unknown;
    } | undefined;
  };

  // Stats content shape
  stats?: {
    ar?: {
      sessions?: number;
      consultations?: number;
      beneficiaries?: number;
      years?: number;
      labels?: Record<string, string>;
      [key: string]: unknown;
    };
    en?: {
      sessions?: number;
      consultations?: number;
      beneficiaries?: number;
      years?: number;
      labels?: Record<string, string>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };

  // Allow other arbitrary top-level keys
  [key: string]: unknown;
}

export const useContent = () => {
  // Placeholder hook for centralized content logic.
  // Components consume `content` from LanguageContext; keep this minimal for now.
  return {};
};
