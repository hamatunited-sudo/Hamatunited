'use client';

import { useMemo, useState } from 'react';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Service } from '@/hooks/useContent';

const hexToRgba = (hex: string, alpha: number) => {
  let sanitized = hex.replace('#', '');
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const parsed = parseInt(sanitized, 16);
  const r = (parsed >> 16) & 255;
  const g = (parsed >> 8) & 255;
  const b = parsed & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Services = () => {
  const { isDark } = useTheme();
  const [expandedFeatures, setExpandedFeatures] = useState<number[]>([]);

  const { language, content } = useLanguage();
  const services = useMemo(() => {
    const servicesByLang = content.services ?? {};
    const fallback = (servicesByLang.ar ?? servicesByLang.en ?? []) as Service[];
    return (servicesByLang[language as keyof typeof servicesByLang] ?? fallback) as Service[];
  }, [content, language]);

  const { servicesUI, servicesUIFallback } = useMemo(() => {
    const group = content.ui?.services ?? {};
    const fallback = group.ar ?? group.en ?? {};
    const localized = group[language as keyof typeof group] ?? fallback;
    return { servicesUI: localized, servicesUIFallback: fallback };
  }, [content, language]);

  const palette = useMemo(() => {
  const accentPrimary = isDark ? '#7DE1DA' : '#50B7AF';
    const accentSecondary = '#fb6a44';
    const sectionBg = isDark ? '#0f172a' : '#f8fafc';
    const cardBg = isDark ? '#111827' : '#ffffff';
    const cardBorder = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.3)';
    const textPrimary = isDark ? '#f8fafc' : '#0f172a';
    const textSecondary = isDark ? '#cbd5f5' : '#475569';

    return {
      accents: { primary: accentPrimary, secondary: accentSecondary },
      sectionBg,
      cardBg,
      cardBorder,
      textPrimary,
      textSecondary
    };
  }, [isDark]);

  const copy = useMemo(
    () => ({
      eyebrow: servicesUI?.eyebrow ?? servicesUIFallback.eyebrow ?? '',
      readMore: servicesUI?.readMore ?? servicesUIFallback.readMore ?? '',
      readLess: servicesUI?.readLess ?? servicesUIFallback.readLess ?? '',
      notes: servicesUI?.notesLabel ?? servicesUIFallback.notesLabel ?? ''
    }),
    [servicesUI, servicesUIFallback]
  );

  const servicesHeading = servicesUI?.heading ?? servicesUIFallback.heading ?? '';
  const servicesSubtitle = servicesUI?.subtitle ?? servicesUIFallback.subtitle ?? '';
  const sessionsLabelFallback = servicesUI?.sessionsLabel ?? servicesUIFallback.sessionsLabel ?? '';
  const durationLabelFallback = servicesUI?.durationLabel ?? servicesUIFallback.durationLabel ?? '';
  const bookButtonLabel = servicesUI?.bookButton ?? servicesUIFallback.bookButton ?? '';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFeaturesExpanded = (index: number) => {
    setExpandedFeatures(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const isFeaturesExpanded = (index: number) => expandedFeatures.includes(index);

  return (
    <section
      id="services"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20"
      style={{ backgroundColor: palette.sectionBg }}
    >
      <span
        className="pointer-events-none absolute -left-16 top-24 hidden h-44 w-44 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(palette.accents.secondary, 0.12) }}
      />
      <span
        className="pointer-events-none absolute -right-20 bottom-24 hidden h-52 w-52 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(palette.accents.primary, 0.1) }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span
            className="inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{
              backgroundColor: hexToRgba(palette.accents.secondary, 0.18),
              color: palette.accents.secondary
            }}
          >
            {copy.eyebrow}
          </span>
          <h2
            className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl"
            style={{ color: palette.textPrimary }}
          >
            {servicesHeading}
          </h2>
          <p
            className="mx-auto mt-3 max-w-3xl text-base sm:text-lg"
            style={{ color: hexToRgba(palette.textSecondary, 0.9) }}
          >
            {servicesSubtitle}
          </p>
    </div>

    <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service: Service, index: number) => {
            const bookingHref = service?.link;
            const isExternal = typeof bookingHref === 'string' && (
              bookingHref.startsWith('http://') ||
              bookingHref.startsWith('https://') ||
              bookingHref.startsWith('//')
            );
            const hasNotes = ((service.notes && service.notes.length > 0) || service.note);
            const useSecondary = index % 2 === 1;
            const accentColor = useSecondary ? palette.accents.secondary : palette.accents.primary;
            const accentTint = hexToRgba(accentColor, isDark ? 0.24 : 0.16);
            const accentShadow = hexToRgba(accentColor, isDark ? 0.46 : 0.24);
            const chipBg = hexToRgba(accentColor, isDark ? 0.25 : 0.14);
            const chipText = isDark ? '#f8fafc' : '#1f2937';
            const sessionsLabelText = (service.sessionsLabel ?? sessionsLabelFallback ?? '').replace(/:\s*$/, '');
            const durationLabelText = (service.durationLabel ?? durationLabelFallback ?? '').replace(/:\s*$/, '');
            const hasExplicitSessions = typeof service.sessionsValue === 'number';
            const shouldShowSessions = hasExplicitSessions
              ? (service.sessionsValue ?? 0) > 0
              : service.sessions > 0;
            const hasExplicitDuration = typeof service.durationValue === 'number';
            const durationBaseValue = service.duration?.split(' ')[0] ?? '';
            const shouldShowDuration = hasExplicitDuration
              ? (service.durationValue ?? 0) > 0
              : Boolean(durationBaseValue && Number.parseInt(durationBaseValue, 10) > 0);
            const durationDisplay = hasExplicitDuration
              ? service.durationValue
              : durationBaseValue;

            return (
            <div
              key={index}
              className="group relative flex h-full w-full flex-col rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up"
              style={{
                backgroundColor: palette.cardBg,
                borderColor: accentTint,
                boxShadow: `0 24px 46px ${hexToRgba('#0f172a', isDark ? 0.55 : 0.08)}`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <span
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: accentColor }}
              />
              <div className="mb-3 sm:mb-4 flex-1">
                <h3
                  className="text-lg font-semibold sm:text-xl"
                  style={{ color: palette.textPrimary }}
                >
                  {service.title}
                </h3>
                
                <div className="relative">
                  <div
                    className="mb-3 text-sm leading-relaxed sm:mb-4"
                    style={{ color: palette.textSecondary }}
                  >
                    {service.description}
                  </div>
                </div>
                
                <div className={`mb-4 sm:mb-6 ${!hasNotes ? 'pb-4 sm:pb-0' : ''}`}>
                  <ul className="space-y-3 text-sm" style={{ color: palette.textSecondary }}>
                    {service.features
                      .slice(0, isFeaturesExpanded(index) ? service.features.length : 7)
                      .map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className={`flex items-start gap-3 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                        <span
                          className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: accentColor }}
                        />
                        <span className="leading-relaxed" style={{ color: palette.textSecondary }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {service.features.length > 7 && (
                    <button
                      onClick={() => toggleFeaturesExpanded(index)}
                      className={`mt-3 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        language === 'en' ? 'text-left' : 'text-right'
                      }`}
                      style={{
                        backgroundColor: hexToRgba(accentColor, isDark ? 0.22 : 0.12),
                        color: palette.textPrimary
                      }}
                    >
                      <span>{isFeaturesExpanded(index) ? copy.readLess : copy.readMore}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isFeaturesExpanded(index) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: palette.textPrimary }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                {/* Notes section */}
                {((service.notes && service.notes.length > 0) || service.note) && (
                  // add extra vertical spacing on mobile (default) but keep tighter spacing on sm+ screens
                  <div className="py-4 sm:py-0 text-sm">
                    <div
                      className={`font-semibold ${language === 'en' ? 'text-left' : 'text-right'}`}
                      dir={language === 'en' ? 'ltr' : undefined}
                      style={{ color: accentColor }}
                    >
                      {copy.notes}
                    </div>
                    <div
                      className={`mt-2 ${language === 'en' ? 'text-left' : 'text-right'}`}
                      dir={language === 'en' ? 'ltr' : undefined}
                      style={{ color: palette.textSecondary }}
                    >
                      {service.notes && service.notes.length > 0 ? (
                        <ul className="space-y-3">
                          {service.notes.map((note: string, noteIndex: number) => (
                            <li key={noteIndex} className="flex items-start gap-2">
                              <span className="whitespace-pre-wrap break-words" style={{ color: palette.textSecondary }}>
                                {note}
                              </span>
                            </li>
                          ))}
                        </ul>
                          ) : service.note ? (
                        <div className="flex items-start gap-2">
                          <span className="whitespace-pre-wrap break-words" style={{ color: palette.textSecondary }}>
                            {service.note}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <div className="mb-3">
                  <div className="flex gap-2 mb-4 sm:mb-2">
                    {shouldShowSessions && (
                      <div
                        className="rounded-xl p-3 text-sm font-semibold md:text-xs lg:text-sm"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        style={{
                          backgroundColor: chipBg,
                          color: chipText
                        }}
                      >
                        <span>{sessionsLabelText}:</span> <span>{hasExplicitSessions ? service.sessionsValue : service.sessions}</span>
                      </div>
                    )}
                    {shouldShowDuration && (
                      <div
                        className="rounded-xl p-3 text-sm font-semibold md:text-xs lg:text-sm"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        style={{
                          backgroundColor: chipBg,
                          color: chipText
                        }}
                      >
                        <span>{durationLabelText}:</span> <span>{durationDisplay}</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="flex items-center justify-between rounded-xl p-4"
                    style={{
                      backgroundColor: hexToRgba(accentColor, isDark ? 0.2 : 0.12),
                      color: palette.textPrimary
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {service.saleEnabled && service.salePrice ? (
                        <div className="flex items-center justify-between w-full gap-4">
                          <div className="relative inline-flex items-center gap-2 text-xl font-bold">
                            <svg width={20} height={20} viewBox="0 0 1124.14 1256.39" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
                              <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
                            </svg>
                            <span>{service.price?.replace ? service.price.replace(' ر.س', '') : service.price}</span>
                            <div
                              className="pointer-events-none absolute left-0 right-0 top-1/2 h-[1px]"
                              style={{ backgroundColor: hexToRgba(palette.textPrimary, 0.5) }}
                            />
                          </div>

                          <div className="flex items-center gap-2 text-xl font-bold" style={{ color: palette.accents.secondary }}>
                            <svg width={20} height={20} viewBox="0 0 1124.14 1256.39" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
                              <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
                            </svg>
                            <span>{service.salePrice?.replace ? service.salePrice.replace(' ر.س', '') : service.salePrice}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xl font-bold">
                            <svg width={20} height={20} viewBox="0 0 1124.14 1256.39" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                              <path fill="currentColor" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
                              <path fill="currentColor" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
                            </svg>
                          <span>{service.price?.replace ? service.price.replace(' ر.س', '') : service.price}</span>
                        </div>
                      )}
                    </div>
                    
                    {bookingHref ? (
                      <a
                        href={bookingHref}
                        className="flex items-center justify-center rounded-lg py-2.5 px-6 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 16px 30px ${accentShadow}`,
                          borderColor: accentColor
                        }}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        onClick={(e) => {
                          // ensure navigation happens even if some parent prevents pointer events
                          try {
                            if (isExternal) {
                              // let default open in new tab if target=_blank
                              return;
                            }
                            e.preventDefault();
                            window.location.href = String(bookingHref);
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          } catch (_err) {
                            // fallback to default behavior
                          }
                        }}
                      >
                        {bookButtonLabel}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection('contact')}
                        className="flex items-center justify-center rounded-lg py-2.5 px-6 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 16px 30px ${accentShadow}`
                        }}
                      >
                        {bookButtonLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
