'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import contentData from '../../content.json';
import type { ContentData } from '@/hooks/useContent';

type Language = 'ar' | 'en';
type ContentType = ContentData;

interface LanguageContextType {
  language: Language;
  content: ContentType;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [content, setContent] = useState<ContentType | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  const fallbackContent = contentData as ContentType;

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }

    // Set document direction and language
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    // Try to load content from the server API so site reflects Supabase/admin changes.
    // Fall back to a saved admin copy in localStorage (for local admin sessions), then to shipped content.
    let mounted = true;

    const applyContent = (json: unknown) => {
      if (!mounted) return;
      setContent(json as ContentType);
      try {
        localStorage.setItem('mohcareer_original_content', JSON.stringify(json));
      } catch {}
    };

    const fetchAndApply = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const json = await res.json();
          applyContent(json);
          return;
        }
      } catch {
        // ignore network errors and fall through to local fallback
      }

      try {
        const saved = localStorage.getItem('mohcareer_original_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          applyContent(parsed);
          return;
        }
      } catch {
        // ignore parse errors
      }

      // fallback to shipped content
      if (mounted) setContent(fallbackContent);
    };

    // initial fetch
    fetchAndApply();

    // Listen for localStorage changes from other tabs (admin saves local copy there)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'mohcareer_original_content') {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            setContent(parsed as ContentType);
          }
        } catch {
          // ignore malformed value
        }
      }
    };

    // When the tab becomes visible, try to re-fetch remote content so updates pushed from admin are picked up
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchAndApply();
      }
    };

    // Custom event from admin page to notify same-tab updates
    const onCustomUpdate = () => {
      fetchAndApply();
    };

    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('mohcareer_content_updated', onCustomUpdate as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mohcareer_content_updated', onCustomUpdate as EventListener);
    };
  }, [fallbackContent]);

  // Render only after content is resolved to avoid showing stale/bundled content
  useEffect(() => {
    if (content !== null) setIsContentReady(true);
  }, [content]);

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);

    // Update document direction and language
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const value: LanguageContextType = {
    language,
    content: content ?? fallbackContent,
    toggleLanguage,
    isRTL: language === 'ar',
  };

  if (!isContentReady) {
    // minimal placeholder while we fetch the authoritative content
    return (
      <LanguageContext.Provider value={value}>
        <div aria-hidden="true" className="min-h-screen flex items-center justify-center">{/* empty to avoid layout shift */}</div>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
