'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Service, ServicePackage } from '@/hooks/useContent';

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

type AudienceKey = 'individuals' | 'enterprise';

interface ServiceCardEntry {
  id: string;
  service: Service;
  pkg?: ServicePackage;
}

interface ServicesCopy {
  eyebrow: string;
  readMore: string;
  readLess: string;
  notes: string;
  audiencesLabel: string;
  audiences: Record<string, string>;
  individualCategoriesLabel: string;
  individualCategories: Record<string, string>;
  emptyStateTitle: string;
  emptyStateDescription: string;
  packagesLabel: string;
  packagePriceLabel: string;
  packageSessionsLabel: string;
}

const Services = () => {
  const { isDark } = useTheme();
  const [expandedFeatures, setExpandedFeatures] = useState<number[]>([]);
  const [activeAudience, setActiveAudience] = useState<AudienceKey>('individuals');
  const [activeCategory, setActiveCategory] = useState<string>('performance');

  const { language, content } = useLanguage();

  const services = useMemo(() => {
    const servicesByLang = content?.services ?? {};
    const fallback = (servicesByLang.ar ?? servicesByLang.en ?? []) as Service[];
    return (servicesByLang[language as keyof typeof servicesByLang] ?? fallback) as Service[];
  }, [content, language]);

  const { servicesUI, servicesUIFallback } = useMemo(() => {
    const group = content?.ui?.services ?? {};
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

  const copy = useMemo<ServicesCopy>(() => {
    const audiences =
      (servicesUI?.audienceOptions ?? servicesUIFallback.audienceOptions ?? {}) as Record<string, string>;
    const individualCategories =
      (servicesUI?.individualCategories ?? servicesUIFallback.individualCategories ?? {}) as Record<string, string>;

    return {
      eyebrow: servicesUI?.eyebrow ?? servicesUIFallback.eyebrow ?? '',
      readMore: servicesUI?.readMore ?? servicesUIFallback.readMore ?? '',
      readLess: servicesUI?.readLess ?? servicesUIFallback.readLess ?? '',
      notes: servicesUI?.notesLabel ?? servicesUIFallback.notesLabel ?? '',
      audiencesLabel: servicesUI?.audiencesLabel ?? servicesUIFallback.audiencesLabel ?? '',
      audiences,
      individualCategoriesLabel:
        servicesUI?.individualCategoriesLabel ?? servicesUIFallback.individualCategoriesLabel ?? '',
      individualCategories,
      emptyStateTitle: servicesUI?.emptyStateTitle ?? servicesUIFallback.emptyStateTitle ?? '',
      emptyStateDescription:
        servicesUI?.emptyStateDescription ?? servicesUIFallback.emptyStateDescription ?? '',
      packagesLabel: servicesUI?.packagesLabel ?? servicesUIFallback.packagesLabel ?? '',
      packagePriceLabel: servicesUI?.packagePriceLabel ?? servicesUIFallback.packagePriceLabel ?? '',
      packageSessionsLabel:
        servicesUI?.packageSessionsLabel ?? servicesUIFallback.packageSessionsLabel ?? ''
    };
  }, [servicesUI, servicesUIFallback]);

  const servicesHeading = servicesUI?.heading ?? servicesUIFallback.heading ?? '';
  const servicesSubtitle = servicesUI?.subtitle ?? servicesUIFallback.subtitle ?? '';
  const sessionsLabelFallback = servicesUI?.sessionsLabel ?? servicesUIFallback.sessionsLabel ?? '';
  const durationLabelFallback = servicesUI?.durationLabel ?? servicesUIFallback.durationLabel ?? '';
  const bookButtonLabel = servicesUI?.bookButton ?? servicesUIFallback.bookButton ?? '';

  const audienceEntries = useMemo(
    () => Object.entries(copy.audiences ?? {}) as Array<[string, string]>,
    [copy.audiences]
  );

  const servicesByAudience = useMemo(() => {
    const grouped: Record<AudienceKey, Service[]> = {
      individuals: [],
      enterprise: []
    };

    services.forEach((service) => {
      const inferredAudience = service.audience ?? (service.isEnterprise ? 'enterprise' : 'individuals');
      const key: AudienceKey = inferredAudience === 'enterprise' ? 'enterprise' : 'individuals';
      grouped[key].push(service);
    });

    return grouped;
  }, [services]);

  const individualCategories = useMemo(() => {
    const groups = new Map<string, Service[]>();

    servicesByAudience.individuals.forEach((service) => {
      const key = service.category ?? 'general';
      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(service);
    });

    return Array.from(groups.entries()).map(([key, groupServices]) => ({
      key,
      services: groupServices
    }));
  }, [servicesByAudience]);

  const individualCategoryEntries = useMemo(
    () =>
      individualCategories.map((category) => ({
        key: category.key,
        label: copy.individualCategories[category.key] ?? category.key
      })),
    [individualCategories, copy.individualCategories]
  );

  const visibleServices = useMemo(() => {
    if (activeAudience === 'enterprise') {
      return servicesByAudience.enterprise;
    }

    if (!activeCategory) {
      return servicesByAudience.individuals;
    }

    const match = individualCategories.find((category) => category.key === activeCategory);
    return match?.services ?? [];
  }, [activeAudience, activeCategory, servicesByAudience, individualCategories]);

  const serviceCards = useMemo(() => {
    return visibleServices.flatMap((service) => {
      const packages = Array.isArray(service.packages) ? service.packages : [];

      if (packages.length === 0) {
        return [
          {
            id: service.title,
            service
          } satisfies ServiceCardEntry
        ];
      }

      return packages.map((pkg, pkgIndex) => ({
        id: `${service.title}-pkg-${pkgIndex}`,
        service,
        pkg
      })) as ServiceCardEntry[];
    });
  }, [visibleServices]);

  const shouldCenterSingleCard = serviceCards.length === 1;
  const hasLonelyDesktopCard = serviceCards.length > 1 && serviceCards.length % 3 === 1;

  useEffect(() => {
    if (activeAudience === 'enterprise') {
      if (activeCategory !== '') {
        setActiveCategory('');
      }
      return;
    }

    const availableKeys = individualCategories.map((category) => category.key);
    if (availableKeys.length === 0) {
      if (activeCategory !== '') {
        setActiveCategory('');
      }
      return;
    }

    if (!availableKeys.includes(activeCategory)) {
      setActiveCategory(availableKeys[0]);
    }
  }, [activeAudience, activeCategory, individualCategories]);

  useEffect(() => {
    if (expandedFeatures.length > 0) {
      setExpandedFeatures([]);
    }
  }, [activeAudience, activeCategory, expandedFeatures]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFeaturesExpanded = (index: number) => {
    setExpandedFeatures((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
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

        {audienceEntries.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-4">
            {copy.audiencesLabel && (
              <span
                className="text-sm font-semibold"
                style={{ color: hexToRgba(palette.textSecondary, 0.85) }}
              >
                {copy.audiencesLabel}
              </span>
            )}
            <div
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
            >
              {audienceEntries.map(([key, label]) => {
                const inferredKey: AudienceKey = key === 'enterprise' ? 'enterprise' : 'individuals';
                const isActive = activeAudience === inferredKey;
                const accent =
                  inferredKey === 'enterprise' ? palette.accents.secondary : palette.accents.primary;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (activeAudience !== inferredKey) {
                        setActiveAudience(inferredKey);
                      }
                    }}
                    className="rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: isActive ? hexToRgba(accent, isDark ? 0.25 : 0.14) : 'transparent',
                      color: isActive ? palette.textPrimary : hexToRgba(palette.textPrimary, 0.75),
                      borderColor: hexToRgba(accent, isDark ? 0.4 : 0.3),
                      boxShadow: isActive ? `0 10px 20px ${hexToRgba(accent, isDark ? 0.35 : 0.18)}` : 'none'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeAudience === 'individuals' && individualCategoryEntries.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            {copy.individualCategoriesLabel && (
              <span
                className="text-sm font-semibold"
                style={{ color: hexToRgba(palette.textSecondary, 0.85) }}
              >
                {copy.individualCategoriesLabel}
              </span>
            )}
            <div
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
            >
              {individualCategoryEntries.map(({ key, label }) => {
                const isActive = activeCategory === key;
                const accent = palette.accents.primary;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (activeCategory !== key) {
                        setActiveCategory(key);
                      }
                    }}
                    className="rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: isActive ? hexToRgba(accent, isDark ? 0.28 : 0.16) : 'transparent',
                      color: isActive ? palette.textPrimary : hexToRgba(palette.textPrimary, 0.75),
                      borderColor: hexToRgba(accent, isDark ? 0.45 : 0.28),
                      boxShadow: isActive ? `0 10px 18px ${hexToRgba(accent, isDark ? 0.32 : 0.16)}` : 'none'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {visibleServices.length === 0 ? (
          <div className="mt-12 text-center">
            {copy.emptyStateTitle && (
              <h3 className="text-xl font-semibold" style={{ color: palette.textPrimary }}>
                {copy.emptyStateTitle}
              </h3>
            )}
            {copy.emptyStateDescription && (
              <p
                className="mt-3 text-base sm:text-lg"
                style={{ color: hexToRgba(palette.textSecondary, 0.85) }}
              >
                {copy.emptyStateDescription}
              </p>
            )}
          </div>
        ) : (
          <div
            className={`mt-10 grid gap-5 sm:mt-12 ${
              shouldCenterSingleCard
                ? 'place-items-center justify-center sm:grid-cols-1 lg:grid-cols-1'
                : 'justify-center sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {serviceCards.map(({ service, pkg, id }, index) => {
              const isLonelyDesktopCard = hasLonelyDesktopCard && index === serviceCards.length - 1;
              const bookingHref = pkg?.link ?? service?.link;
              const isExternal =
                typeof bookingHref === 'string' &&
                (bookingHref.startsWith('http://') ||
                  bookingHref.startsWith('https://') ||
                  bookingHref.startsWith('//'));
              const featureList = Array.isArray(service.features) ? service.features : [];
              const useSecondary = index % 2 === 1;
              const accentColor = useSecondary ? palette.accents.secondary : palette.accents.primary;
              const accentTint = hexToRgba(accentColor, isDark ? 0.24 : 0.16);
              const accentShadow = hexToRgba(accentColor, isDark ? 0.46 : 0.24);
              const chipBg = hexToRgba(accentColor, isDark ? 0.25 : 0.14);
              const chipText = isDark ? '#f8fafc' : '#1f2937';
              const sessionsLabelText = (service.sessionsLabel ?? sessionsLabelFallback ?? '').replace(/:\s*$/, '');
              const durationLabelText = (service.durationLabel ?? durationLabelFallback ?? '').replace(/:\s*$/, '');
              const pkgSessions = typeof pkg?.sessions === 'number' ? pkg.sessions : undefined;
              const baseSessionsValue =
                service.sessionsValue ?? (typeof service.sessions === 'number' ? service.sessions : 0);
              const cardSessionsValue = pkgSessions ?? baseSessionsValue;
              const shouldShowSessions = Number(cardSessionsValue) > 0;

              const rawDurationText = typeof service.duration === 'string' ? service.duration : '';
              const durationNumericCandidate = service.durationValue ??
                (rawDurationText ? Number.parseInt(rawDurationText.split(' ')[0] ?? '', 10) : undefined);
              const cardDurationDisplay =
                service.durationValue !== undefined && service.durationValue !== null
                  ? `${service.durationValue}`
                  : rawDurationText;
              const shouldShowDuration = Boolean(durationLabelText && durationNumericCandidate && durationNumericCandidate > 0);

              const cardPrice = pkg?.price ?? (service.saleEnabled && service.salePrice ? service.salePrice : service.price);
              const cardOriginalPrice = pkg?.originalPrice ??
                (service.saleEnabled && service.salePrice
                  ? service.saleOriginalPrice ?? service.price
                  : undefined);
              const cardDiscount = pkg?.discount;
              const cardTitle = pkg?.name ?? service.title;
              const serviceBadge = pkg ? service.title : undefined;
              const cardDescription = service.description;
              const packageSummary = pkg?.description;
              const packageNotes = Array.isArray(pkg?.notes) ? pkg.notes : [];
              const packageNoteText = pkg?.note;
              const serviceNotes = Array.isArray(service.notes) ? service.notes : [];
              const cardNotes = packageNotes.length > 0
                ? packageNotes
                : packageSummary
                  ? [packageSummary]
                  : serviceNotes;
              const cardNoteText =
                packageNotes.length > 0
                  ? packageNoteText
                  : packageNoteText ?? (cardNotes.length === 0 ? service.note : undefined);
              const hasCardNotes = cardNotes.length > 0 || Boolean(cardNoteText);

              return (
                <div
                  key={id}
                  className={`group relative flex h-full w-full max-w-[360px] flex-col rounded-2xl border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-in-up${
                    isLonelyDesktopCard ? ' lg:col-start-2 lg:justify-self-center' : ''
                  }`}
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
                      {cardTitle}
                    </h3>

                    {serviceBadge && (
                      <span
                        className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: hexToRgba(accentColor, isDark ? 0.3 : 0.16),
                          color: palette.textPrimary
                        }}
                      >
                        {serviceBadge}
                      </span>
                    )}

                    <div className="relative">
                      <div
                        className="mb-3 text-sm leading-relaxed sm:mb-4"
                        style={{ color: palette.textSecondary }}
                      >
                        {cardDescription}
                      </div>
                    </div>

                    <div className={`mb-4 sm:mb-6 ${!hasCardNotes ? 'pb-4 sm:pb-0' : ''}`}>
                      <ul className="space-y-3 text-sm" style={{ color: palette.textSecondary }}>
                        {featureList
                          .slice(0, isFeaturesExpanded(index) ? featureList.length : 7)
                          .map((feature: string, featureIndex: number) => (
                            <li
                              key={`${feature}-${featureIndex}`}
                              className={`flex items-start gap-3 ${
                                language === 'en' ? 'text-left' : 'text-right'
                              }`}
                            >
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

                      {featureList.length > 7 && (
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

                    {hasCardNotes && (
                      <div className="py-4 text-sm sm:py-0">
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
                          {cardNotes && cardNotes.length > 0 ? (
                            <ul className="space-y-3">
                              {cardNotes.map((note: string, noteIndex: number) => (
                                <li key={`${note}-${noteIndex}`} className="flex items-start gap-2">
                                  <span className="whitespace-pre-wrap break-words" style={{ color: palette.textSecondary }}>
                                    {note}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : cardNoteText ? (
                            <div className="flex items-start gap-2">
                              <span className="whitespace-pre-wrap break-words" style={{ color: palette.textSecondary }}>
                                {cardNoteText}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="mb-3">
                      <div className="mb-4 flex gap-2 sm:mb-2">
                        {shouldShowSessions && (
                          <div
                            className="rounded-xl p-3 text-sm font-semibold md:text-xs lg:text-sm"
                            dir={language === 'ar' ? 'rtl' : 'ltr'}
                            style={{
                              backgroundColor: chipBg,
                              color: chipText
                            }}
                          >
                            <span>{sessionsLabelText}:</span>{' '}
                            <span>{cardSessionsValue}</span>
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
                            <span>{durationLabelText}:</span> <span>{cardDurationDisplay}</span>
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
                        <div className={`flex flex-col ${language === 'en' ? 'text-left' : 'text-right'}`}>
                          {cardOriginalPrice && (
                            <span
                              className="text-sm font-semibold line-through"
                              style={{ color: hexToRgba(palette.textPrimary, 0.6) }}
                            >
                              {cardOriginalPrice}
                            </span>
                          )}
                          <span className="text-xl font-bold">
                            {cardPrice}
                          </span>
                          {cardDiscount && (
                            <span className="text-xs font-semibold" style={{ color: palette.accents.secondary }}>
                              {cardDiscount}
                            </span>
                          )}
                        </div>

                        {bookingHref ? (
                          <a
                            href={bookingHref}
                            className="flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                            style={{
                              backgroundColor: accentColor,
                              boxShadow: `0 16px 30px ${accentShadow}`,
                              borderColor: accentColor
                            }}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            onClick={(event) => {
                              try {
                                if (isExternal) {
                                  return;
                                }
                                event.preventDefault();
                                window.location.href = String(bookingHref);
                              } catch {
                                // fallback to default navigation
                              }
                            }}
                          >
                            {bookButtonLabel}
                          </a>
                        ) : (
                          <button
                            onClick={() => scrollToSection('contact')}
                            className="flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
        )}
      </div>
    </section>
  );
};

export default Services;
