/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useEffect, useState, useMemo, type CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { HeartHandshake, BadgeCheck, Target, LineChart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const hexToRgba = (hex: string, alpha: number) => {
  let sanitized = hex.replace('#', '');
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const WhyChooseMe = () => {
  const { isDark, isLoaded } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for theme changes and manage transitions smoothly
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

  // Memoize theme styles to prevent unnecessary recalculations
  const themeStyles = useMemo(() => {
  const primaryAccent = isDark ? '#7DE1DA' : '#50B7AF';
    const secondaryAccent = '#fb6a44';
    const sectionBg = isDark ? '#0f172a' : '#f8fafc';
    const cardBg = isDark ? '#111827' : '#ffffff';
    const cardBorder = isDark ? 'rgba(148, 163, 184, 0.28)' : 'rgba(148, 163, 184, 0.35)';

    return {
      section: {
        backgroundColor: sectionBg,
        backgroundImage: 'none'
      },
      card: {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        boxShadow: isDark
          ? '0px 18px 40px rgba(7, 15, 35, 0.55)'
          : '0px 18px 36px rgba(15, 23, 42, 0.08)'
      },
      accent: {
        primary: primaryAccent,
        secondary: secondaryAccent
      },
      text: {
        heading: isDark ? '#f8fafc' : '#111827',
        body: isDark ? '#d1d5db' : '#111827'
      },
      hover: {
        primary: hexToRgba(primaryAccent, isDark ? 0.18 : 0.12),
        secondary: hexToRgba(secondaryAccent, isDark ? 0.16 : 0.1)
      }
    };
  }, [isDark]);

  // call hooks unconditionally
  const { language, content } = useLanguage();
  const contentAny = content as any;
  const defaultWhyUI = contentAny.ui?.whyChoose?.ar ?? {};
  const whyUI = contentAny.ui?.whyChoose?.[language] ?? defaultWhyUI;

  const sectionCopy = useMemo(
    () => ({
      eyebrow: whyUI.eyebrow ?? '',
      title: whyUI.title ?? '',
      description: whyUI.description ?? ''
    }),
    [whyUI]
  );

  const featureIcons = useMemo<LucideIcon[]>(
    () => [HeartHandshake, BadgeCheck, Target, LineChart, Sparkles],
    []
  );

  if (!mounted || !isLoaded) {
    return (
      <section className="py-12 sm:py-16 md:py-20 min-h-[500px] flex items-center justify-center">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="w-48 h-8 bg-gray-300 rounded mb-8 mx-auto"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 p-4">
                <div className="w-8 h-8 bg-gray-300 rounded-xl"></div>
                <div className="flex-1 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  // read features from centralized content.json for current language with Arabic fallback
  const features = contentAny.whyChoose?.[language] ?? contentAny.whyChoose?.ar ?? [];

  const styles = themeStyles;

  return (
    <section
      id="why-choose"
      className={`relative overflow-hidden py-12 sm:py-16 md:py-20 transition-all duration-500 ease-in-out ${
        isTransitioning ? 'opacity-95' : 'opacity-100'
      }`}
      style={styles.section}
    >
      <span
        className="pointer-events-none absolute -left-12 top-16 hidden h-32 w-32 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(styles.accent.secondary, 0.12) }}
      />
      <span
        className="pointer-events-none absolute -right-14 bottom-12 hidden h-40 w-40 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(styles.accent.primary, 0.12) }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{
                backgroundColor: hexToRgba(styles.accent.secondary, 0.16),
                color: styles.accent.secondary
              }}
            >
              {sectionCopy.eyebrow}
            </span>
            <h2
              className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ color: styles.text.heading }}
            >
              {sectionCopy.title}
            </h2>
            <p
              className="mx-auto mt-3 max-w-3xl text-base sm:text-lg"
              style={{ color: hexToRgba(styles.text.body, 0.9) }}
            >
              {sectionCopy.description}
            </p>
          </div>

          <div className="mt-12 sm:mt-14">
            <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 sm:gap-6">
              {features.map((feature: { text: string; icon?: string }, index: number) => {
                const useSecondary = index % 2 === 1;
                const accentColor = useSecondary ? styles.accent.secondary : styles.accent.primary;
                const hoverColor = useSecondary ? styles.hover.secondary : styles.hover.primary;
                const borderColor = hexToRgba(accentColor, useSecondary ? 0.22 : 0.18);
                const iconShadow = hexToRgba(accentColor, isDark ? 0.4 : 0.22);
                const FeatureIcon: LucideIcon = featureIcons[index] ?? Sparkles;

                const cardStyle: CSSProperties = {
                  backgroundColor: styles.card.backgroundColor,
                  border: `1px solid ${borderColor}`,
                  boxShadow: styles.card.boxShadow
                };

                return (
                  <div
                    key={index}
                    className="group relative flex h-full items-start gap-4 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1"
                    style={cardStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = styles.card.backgroundColor;
                    }}
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 12px 30px ${iconShadow}`
                      }}
                    >
                      <FeatureIcon className="h-6 w-6" strokeWidth={1.6} />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-base leading-relaxed sm:text-lg"
                        style={{ color: styles.text.body }}
                      >
                        {feature.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseMe;