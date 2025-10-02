/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const hexToRgba = (hex: string, alpha: number) => {
  let sanitized = hex.replace('#', '');
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const value = parseInt(sanitized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type SocialPlatform = { name: string; url: string };

const Socials = () => {
  const { isDark, isLoaded } = useTheme();
  const { language, content } = useLanguage();
  const contentAny = content as any;
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const socialUI = useMemo(() => {
    const socialsGroup = (content as any).ui?.socials ?? {};
    const fallback = socialsGroup?.ar ?? {};
    return socialsGroup?.[language] ?? fallback;
  }, [content, language]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const palette = useMemo(() => {
  const primary = isDark ? '#7DE1DA' : '#50B7AF';
    const secondary = '#fb6a44';

    return {
      sectionBg: isDark ? '#0f172a' : '#f8fafc',
      cardBg: isDark ? '#111827' : '#ffffff',
      cardBorder: isDark ? 'rgba(148, 163, 184, 0.28)' : 'rgba(148, 163, 184, 0.22)',
      textPrimary: isDark ? '#f8fafc' : '#0f172a',
      textSecondary: isDark ? '#cbd5f5' : '#475569',
      accents: {
        primary,
        secondary
      }
    };
  }, [isDark]);

  const accentCopy = useMemo(
    () => ({
      eyebrow: socialUI.eyebrow ?? '',
      title: socialUI.title ?? '',
      description: socialUI.description ?? ''
    }),
    [socialUI]
  );

  const socialPlatforms: SocialPlatform[] = useMemo(() => {
  const fallback: SocialPlatform[] = [];

    const supportedNames = new Set([
      'instagram',
      'snapchat',
      'snap',
      'x',
      'x (twitter)',
      'twitter',
      'tiktok',
      'linkedin',
      'telegram'
    ]);

    const raw = Array.isArray(contentAny?.socials) ? (contentAny.socials as SocialPlatform[]) : fallback;
    const sanitized = raw.reduce<SocialPlatform[]>((acc, entry) => {
      if (!entry || typeof entry !== 'object') return acc;
      const name = typeof entry.name === 'string' ? entry.name.trim() : '';
      const url = typeof entry.url === 'string' ? entry.url.trim() : '';
      if (!name || !url) return acc;
      const normalized = name.toLowerCase();
      if (!supportedNames.has(normalized)) return acc;
      if (acc.find((platform) => platform.name.toLowerCase() === normalized)) {
        return acc;
      }
      acc.push({ name, url });
      return acc;
    }, []);

    return sanitized;
  }, [contentAny?.socials]);

  const renderSocialIcon = (name: string) => {
    switch (name) {
      case 'Instagram':
        return (
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'Snapchat':
      case 'Snap':
        return (
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 512 512" aria-hidden>
            <path d="M496.926,366.6c-3.373-9.176-9.8-14.086-17.112-18.153-1.376-.806-2.641-1.451-3.72-1.947-2.182-1.128-4.414-2.22-6.634-3.373-22.8-12.09-40.609-27.341-52.959-45.42a102.889,102.889,0,0,1-9.089-16.12c-1.054-3.013-1-4.724-.248-6.287a10.221,10.221,0,0,1,2.914-3.038c3.918-2.591,7.96-5.22,10.7-6.993,4.885-3.162,8.754-5.667,11.246-7.44,9.362-6.547,15.909-13.5,20-21.278a42.371,42.371,0,0,0,2.1-35.191c-6.2-16.318-21.613-26.449-40.287-26.449a55.543,55.543,0,0,0-11.718,1.24c-1.029.224-2.059.459-3.063.72.174-11.16-.074-22.94-1.066-34.534-3.522-40.758-17.794-62.123-32.674-79.16A130.167,130.167,0,0,0,332.1,36.443C309.515,23.547,283.91,17,256,17S202.6,23.547,180,36.443a129.735,129.735,0,0,0-33.281,26.783c-14.88,17.038-29.152,38.44-32.673,79.161-.992,11.594-1.24,23.435-1.079,34.533-1-.26-2.021-.5-3.051-.719a55.461,55.461,0,0,0-11.717-1.24c-18.687,0-34.125,10.131-40.3,26.449a42.423,42.423,0,0,0,2.046,35.228c4.105,7.774,10.652,14.731,20.014,21.278,2.48,1.736,6.361,4.24,11.246,7.44,2.641,1.711,6.5,4.216,10.28,6.72a11.054,11.054,0,0,1,3.3,3.311c.794,1.624.818,3.373-.36,6.6a102.02,102.02,0,0,1-8.94,15.785c-12.077,17.669-29.363,32.648-51.434,44.639C32.355,348.608,20.2,352.75,15.069,366.7c-3.868,10.528-1.339,22.506,8.494,32.6a49.137,49.137,0,0,0,12.4,9.387,134.337,134.337,0,0,0,30.342,12.139,20.024,20.024,0,0,1,6.126,2.741c3.583,3.137,3.075,7.861,7.849,14.78a34.468,34.468,0,0,0,8.977,9.127c10.019,6.919,21.278,7.353,33.207,7.811,10.776.41,22.989.881,36.939,5.481,5.778,1.91,11.78,5.605,18.736,9.92C194.842,480.951,217.707,495,255.973,495s61.292-14.123,78.118-24.428c6.907-4.24,12.872-7.9,18.489-9.758,13.949-4.613,26.163-5.072,36.939-5.481,11.928-.459,23.187-.893,33.206-7.812a34.584,34.584,0,0,0,10.218-11.16c3.434-5.84,3.348-9.919,6.572-12.771a18.971,18.971,0,0,1,5.753-2.629A134.893,134.893,0,0,0,476.02,408.71a48.344,48.344,0,0,0,13.019-10.193l.124-.149C498.389,388.5,500.708,376.867,496.926,366.6Z" />
          </svg>
        );
      case 'X':
      case 'Twitter':
      case 'X (Twitter)':
        return (
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.8l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'TikTok':
      case 'Tiktok':
        return (
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        );
      case 'LinkedIn':
      case 'Linkedin':
        return (
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'Telegram':
      case 'TeleGram':
        return (
          <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 448 512" aria-hidden>
            <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!mounted || !isLoaded) {
    return (
      <section className="flex min-h-[400px] items-center justify-center py-12 sm:py-16 md:py-20">
        <div className="animate-pulse text-center">
          <div className="mx-auto mb-8 h-8 w-32 rounded bg-gray-300" />
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 w-12 rounded-xl bg-gray-300" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="socials"
      className={`relative overflow-hidden py-12 sm:py-16 md:py-20 transition-all duration-500 ease-in-out ${
        isTransitioning ? 'opacity-95' : 'opacity-100'
      }`}
      style={{ backgroundColor: palette.sectionBg }}
    >
      <span
        className="pointer-events-none absolute -left-12 top-20 hidden h-40 w-40 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(palette.accents.secondary, 0.12) }}
      />
      <span
        className="pointer-events-none absolute -right-16 bottom-24 hidden h-48 w-48 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(palette.accents.primary, 0.12) }}
      />

      <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10 sm:mb-12">
            <span
              className="inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
              style={{
                backgroundColor: hexToRgba(palette.accents.secondary, 0.18),
                color: palette.accents.secondary
              }}
            >
              {accentCopy.eyebrow}
            </span>
            <h2
              className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ color: palette.textPrimary }}
            >
              {accentCopy.title}
            </h2>
            <p
              className="mx-auto mt-3 max-w-3xl text-base sm:text-lg"
              style={{ color: hexToRgba(palette.textSecondary, 0.9) }}
            >
              {accentCopy.description}
            </p>
          </div>

          <div
            className="rounded-3xl border px-6 py-10 shadow-xl transition-shadow duration-500 sm:px-8"
            style={{
              backgroundColor: palette.cardBg,
              borderColor: palette.cardBorder,
              boxShadow: isDark
                ? '0 28px 48px rgba(7, 15, 35, 0.55)'
                : '0 22px 40px rgba(15, 23, 42, 0.1)'
            }}
          >
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-7">
              {socialPlatforms.map((platform, index) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.name}
                  className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border text-lg transition-transform duration-300 sm:h-16 sm:w-16"
                  style={{
                    borderColor: palette.accents.primary,
                    backgroundColor: hexToRgba(palette.accents.primary, 0.1),
                    color: palette.accents.primary,
                    animation: `fadeInUp 0.6s ease-out ${0.6 + index * 0.08}s both`
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = palette.accents.secondary;
                    el.style.backgroundColor = hexToRgba(palette.accents.secondary, 0.12);
                    el.style.color = palette.accents.secondary;
                    el.style.transform = 'translateY(-8px) scale(1.05)';
                    el.style.boxShadow = `0 18px 32px ${hexToRgba(palette.accents.secondary, 0.32)}`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = palette.accents.primary;
                    el.style.backgroundColor = hexToRgba(palette.accents.primary, 0.1);
                    el.style.color = palette.accents.primary;
                    el.style.transform = 'translateY(0) scale(1)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ backgroundColor: hexToRgba(palette.accents.secondary, 0.08) }}
                  />
                  <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                    {renderSocialIcon(platform.name)}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-10 sm:mt-12">
              <p className="text-sm leading-relaxed sm:text-base" style={{ color: palette.textSecondary }}>
                {socialUI.cta ?? ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Socials;
