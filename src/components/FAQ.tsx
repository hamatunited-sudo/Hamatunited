'use client';

import { useMemo, useState } from 'react';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

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

const FAQ = () => {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState(-1);
  const { language, content } = useLanguage();

  const faqUIGroup = content.ui?.faq ?? {};
  const faqUIFallback = faqUIGroup.ar ?? faqUIGroup.en ?? {};
  const faqUI = faqUIGroup[language as keyof typeof faqUIGroup] ?? faqUIFallback;

  const palette = useMemo(() => {
  const primary = isDark ? '#7DE1DA' : '#50B7AF';
    const secondary = '#fb6a44';
    const sectionBg = isDark ? '#0f172a' : '#f8fafc';
    const cardBg = isDark ? '#111827' : '#ffffff';
    const cardBorder = isDark ? 'rgba(99, 102, 241, 0.18)' : 'rgba(100, 116, 139, 0.22)';
    const heading = isDark ? '#f8fafc' : '#0f172a';
    const body = isDark ? '#cbd5f5' : '#475569';
    const divider = isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.35)';

    return {
      accents: {
        primary,
        secondary
      },
      section: {
        backgroundColor: sectionBg
      },
      card: {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        boxShadow: isDark
          ? '0 24px 45px rgba(8, 15, 35, 0.55)'
          : '0 20px 36px rgba(15, 23, 42, 0.12)'
      },
      text: {
        heading,
        body
      },
      divider,
      answerBg: isDark ? '#0b1120' : '#f1f5f9'
    };
  }, [isDark]);

  type FAQItem = { question: string; answer: string };
  const faqItemsByLang = content.faq ?? {};
  const fallbackFaqs = faqItemsByLang.ar ?? faqItemsByLang.en ?? [];
  const faqs: FAQItem[] = (faqItemsByLang[language as keyof typeof faqItemsByLang] ?? fallbackFaqs) as FAQItem[];

  const faqEyebrow = faqUI?.eyebrow ?? faqUIFallback.eyebrow ?? '';
  const faqTitle = faqUI?.title ?? faqUIFallback.title ?? '';
  const faqDescription = faqUI?.description ?? faqUIFallback.description ?? '';

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-16 sm:py-20"
      style={palette.section}
    >
      <span
        className="pointer-events-none absolute -left-12 top-24 hidden h-40 w-40 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(palette.accents.secondary, 0.12) }}
      />
      <span
        className="pointer-events-none absolute -right-16 bottom-20 hidden h-48 w-48 rounded-full sm:block"
        style={{ backgroundColor: hexToRgba(palette.accents.primary, 0.1) }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <span
            className="inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{
              backgroundColor: hexToRgba(palette.accents.secondary, 0.18),
              color: palette.accents.secondary
            }}
          >
            {String(faqEyebrow)}
          </span>
          <h2
            className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ color: palette.text.heading }}
          >
            {String(faqTitle)}
          </h2>
          <p
            className="mx-auto mt-3 max-w-3xl text-base sm:text-lg"
            style={{ color: hexToRgba(palette.text.body, 0.9) }}
          >
            {String(faqDescription)}
          </p>
        </div>

        <div className="mt-12 space-y-5 sm:mt-14">
          {faqs.map((faq: FAQItem, index: number) => {
            const isOpen = openIndex === index;
            const useSecondary = index % 2 === 1;
            const accentColor = useSecondary ? palette.accents.secondary : palette.accents.primary;
            const subtleAccent = hexToRgba(accentColor, isDark ? 0.22 : 0.14);
            const iconBg = isOpen ? accentColor : hexToRgba(accentColor, 0.85);

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: palette.card.backgroundColor,
                  borderColor: isOpen ? accentColor : palette.card.borderColor,
                  boxShadow: palette.card.boxShadow
                }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: accentColor }}
                />
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center gap-4 px-6 py-6 text-start transition-colors duration-200 sm:px-8 ${
                    language === 'en' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  style={{ color: palette.text.heading }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: iconBg,
                      boxShadow: `0 18px 32px ${hexToRgba(accentColor, isDark ? 0.5 : 0.25)}`
                    }}
                  >
                    <HelpCircle className="h-6 w-6" strokeWidth={1.7} />
                  </div>
                  <div className="flex-1" dir={language === 'en' ? 'ltr' : 'rtl'}>
                    <h3 className="text-lg font-semibold sm:text-xl">{faq.question}</h3>
                    <div
                      className="mt-2 h-0.5 w-10 rounded-full transition-all duration-300 group-hover:w-16"
                      style={{ backgroundColor: subtleAccent }}
                    />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-200"
                    style={{
                      borderColor: subtleAccent,
                      backgroundColor: hexToRgba(accentColor, 0.12),
                      color: accentColor
                    }}
                  >
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div
                    className={`border-t px-6 pb-6 sm:px-8 ${language === 'en' ? 'text-left' : 'text-right'}`}
                    style={{
                      borderColor: palette.divider,
                      backgroundColor: hexToRgba(accentColor, isDark ? 0.12 : 0.08),
                      color: palette.text.body
                    }}
                  >
                    <p className="pt-5 text-base leading-relaxed sm:text-lg" dir={language === 'en' ? 'ltr' : 'rtl'}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
