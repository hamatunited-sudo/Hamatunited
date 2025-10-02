'use client';

import { Award, BadgeCheck, Briefcase, GraduationCap, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

import { useTheme } from '@/contexts/UnifiedThemeContext';
import { getThemeClasses } from '@/lib/theme-utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ContentData } from '@/hooks/useContent';

const About = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);

  const { language, content } = useLanguage();
  const aboutSection = content.about ?? ({} as ContentData['about']);
  const aboutFallback = aboutSection?.ar ?? aboutSection?.en ?? {};
  const aboutContent = aboutSection?.[language as keyof typeof aboutSection] ?? aboutFallback;

  const aboutUIGroup = content.ui?.about ?? {};
  const aboutUIFallback = aboutUIGroup?.ar ?? aboutUIGroup?.en ?? {};
  const aboutUI = aboutUIGroup?.[language as keyof typeof aboutUIGroup] ?? aboutUIFallback;

  const accentPrimary = '#50b7af';
  const accentSecondary = '#fb6a44';

  const heading = aboutContent?.heading ?? aboutFallback.heading ?? '';
  const description = aboutContent?.description ?? aboutFallback.description ?? '';
  const passion = aboutContent?.passion ?? aboutFallback.passion ?? '';
  const qualifications = (aboutContent?.qualifications ?? aboutFallback.qualifications ?? []) as string[];
  const cta = aboutContent?.cta ?? aboutFallback.cta ?? '';
  const ctaLink = aboutContent?.ctaLink ?? aboutFallback.ctaLink ?? '';

  const sectionTag = aboutUI?.sectionTag ?? aboutUIFallback.sectionTag ?? '';
  const passionTitle = aboutUI?.passionTitle ?? aboutUIFallback.passionTitle ?? '';
  const passionSubtitle = aboutUI?.passionSubtitle ?? aboutUIFallback.passionSubtitle ?? '';
  const qualificationsTitle = aboutUI?.qualificationsTitle ?? aboutUIFallback.qualificationsTitle ?? '';
  const ctaCardTitle = aboutUI?.ctaCardTitle ?? aboutUIFallback.ctaCardTitle ?? '';
  const ctaCardSubtitle = aboutUI?.ctaCardSubtitle ?? aboutUIFallback.ctaCardSubtitle ?? '';
  const credentialsDescription = aboutUI?.credentialsDescription ?? aboutUIFallback.credentialsDescription ?? '';
  const credentialCountLabel = aboutUI?.credentialCountLabel ?? aboutUIFallback.credentialCountLabel ?? '';

  const qualificationIcons = [Award, Users, Briefcase, GraduationCap, BadgeCheck, Sparkles, Target, TrendingUp];

  const logicalStart = language === 'ar' ? 'right-0' : 'left-0';
  const logicalEndInset = language === 'ar' ? 'left-2' : 'right-2';

  const handleCtaClick = () => {
    if (ctaLink) {
      if (ctaLink.startsWith('http://') || ctaLink.startsWith('https://') || ctaLink.startsWith('//')) {
        window.open(ctaLink, '_blank');
        return;
      }

      if (ctaLink.startsWith('/')) {
        window.location.href = ctaLink;
        return;
      }

      const anchor = ctaLink.replace(/^#|^\/+/, '');
      const anchorElement = document.getElementById(anchor) || document.getElementById('contact');
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      try {
        window.location.href = ctaLink;
        return;
      } catch (error) {
        console.warn('CTA navigation failed', error);
      }
    }

    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section
        id="about"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        className={`py-12 sm:py-16 md:py-24 ${theme.bgSecondary} section-offset`}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div
              className={`relative overflow-hidden rounded-[32px] border ${
                isDark ? 'border-white/10' : 'border-[#50b7af]/15'
              } ${
                isDark
                  ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                  : 'bg-gradient-to-br from-white via-[#50b7af]/10 to-[#50b7af]/5'
              }`}
            >
              <div
                className="absolute -top-24 -left-20 h-60 w-60 rounded-full blur-3xl"
                style={{ backgroundColor: `${accentPrimary}33` }}
                aria-hidden="true"
              />
              <div
                className="absolute top-14 right-14 hidden h-36 w-36 rounded-full blur-3xl lg:block"
                style={{ backgroundColor: `${accentSecondary}33` }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-20 right-1/4 hidden h-48 w-48 rounded-full blur-3xl md:block"
                style={{ backgroundColor: `${accentSecondary}26` }}
                aria-hidden="true"
              />

              <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-16">
                <div className="space-y-12">
                  <div className="grid gap-8 lg:grid-cols-[1.5fr_minmax(0,1fr)] items-start">
                    <div className="space-y-8">
                      <div
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm"
                        style={{
                          borderColor: isDark ? `${accentSecondary}40` : `${accentSecondary}33`,
                          backgroundColor: isDark ? `${accentSecondary}26` : `${accentSecondary}1a`,
                          color: isDark ? '#fce7e2' : '#b04528',
                        }}
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>{sectionTag}</span>
                      </div>

                      <div className="space-y-4 text-start">
                        <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${theme.textPrimary} leading-tight`}>
                          {heading}
                        </h2>
                        <p className={`text-base sm:text-lg md:text-xl leading-relaxed ${theme.textSecondary}`}>
                          {description}
                        </p>
                      </div>

                      <div
                        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 md:p-8 ${
                          isDark
                            ? 'border-white/10 bg-white/[0.06]'
                            : 'border-[#50b7af]/20 bg-white'
                        } shadow-lg shadow-[#50b7af]/15`}
                      >
                        <div
                          className={`absolute inset-y-0 ${logicalStart} w-1`}
                          style={{
                            backgroundColor: accentSecondary,
                          }}
                          aria-hidden="true"
                        />
                        <div className="flex items-start gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                            style={{
                              backgroundColor: accentSecondary,
                              boxShadow: `0 20px 35px -18px ${accentSecondary}99`,
                            }}
                          >
                            <Target className="h-6 w-6" />
                          </div>
                          <div className="space-y-2 text-start">
                            <h3 className={`text-lg sm:text-xl font-semibold ${theme.textPrimary}`}>
                              {passionTitle}
                            </h3>
                            <p className={`${theme.textSecondary} text-sm sm:text-base leading-relaxed`}>
                              {passion}
                            </p>
                            <p className={`${theme.textTertiary} text-xs sm:text-sm`}>
                              {passionSubtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <aside className="space-y-6">
                      <div
                        className={`rounded-3xl border px-6 py-7 sm:px-8 sm:py-8 text-white shadow-xl ${
                          isDark ? 'border-white/20' : 'border-[#50b7af]/25'
                        }`}
                        style={{
                          backgroundColor: accentSecondary,
                          boxShadow: isDark
                            ? `0 25px 45px -18px rgba(251,106,68,0.35)`
                            : `0 25px 45px -18px rgba(251,106,68,0.25)`
                        }}
                      >
                        <div className="space-y-5 text-start">
                          <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-semibold leading-tight">
                              {ctaCardTitle}
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-white/85">
                              {ctaCardSubtitle}
                            </p>
                          </div>
                          {cta && (
                            <button
                              onClick={handleCtaClick}
                              className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300"
                              style={{
                                backgroundColor: accentSecondary,
                                boxShadow: `0 18px 30px -14px ${accentSecondary}88`
                              }}
                            >
                              {cta}
                              <span
                                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white"
                                style={{
                                  backgroundColor: accentSecondary,
                                }}
                              >
                                →
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      {(qualifications[0] || qualifications[1]) && (
                        <div
                          className={`rounded-3xl border px-6 py-6 sm:px-7 sm:py-7 ${
                            isDark ? 'border-white/10 bg-white/5' : 'border-[#50b7af]/15 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-white"
                              style={{
                                borderColor: `${accentSecondary}33`,
                                backgroundColor: accentSecondary,
                              }}
                            >
                              <Award className="h-6 w-6" />
                            </div>
                            <div className="space-y-2 text-start">
                              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>
                                +{qualifications.length} {credentialCountLabel}
                              </h3>
                              {qualifications[0] ? (
                                <p className={`${theme.textSecondary} text-sm leading-relaxed`}>
                                  {qualifications[0]}
                                </p>
                              ) : null}
                              {qualifications[1] ? (
                                <p className={`${theme.textTertiary} text-sm leading-relaxed`}>
                                  {qualifications[1]}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )}
                    </aside>
                  </div>

                  <div
                    className={`rounded-3xl border px-6 py-5 sm:px-7 sm:py-6 text-start ${
                      isDark ? 'border-white/10 bg-white/5' : 'border-[#50b7af]/15 bg-white'
                    }`}
                  >
                    <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-3`}>
                      {qualificationsTitle}
                    </h3>
                    <p className={`${theme.textSecondary} text-sm leading-relaxed`}>
                      {credentialsDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {qualifications.map((item, index) => {
                      const Icon = qualificationIcons[index % qualificationIcons.length];
                      return (
                        <article
                          key={item}
                          className={`group relative overflow-hidden rounded-3xl border px-6 py-6 sm:px-7 sm:py-7 transition-all duration-300 ${
                            isDark
                              ? 'border-white/10 bg-white/5 shadow-[0_25px_45px_-18px_rgba(251,106,68,0.35)]'
                              : 'border-[#50b7af]/20 bg-white shadow-[0_25px_45px_-18px_rgba(251,106,68,0.25)]'
                          } ${theme.cardHover}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                              style={{
                                backgroundColor: accentSecondary,
                                boxShadow: `0 18px 32px -18px ${accentSecondary}88`
                              }}
                            >
                              <Icon className="h-6 w-6" />
                              <span
                                className={`absolute -bottom-2 ${logicalEndInset} flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white shadow`}
                                style={{
                                  backgroundColor: accentSecondary,
                                }}
                              >
                                {(index + 1).toString().padStart(2, '0')}
                              </span>
                            </div>
                            <p className={`${theme.textSecondary} text-sm sm:text-base leading-relaxed`}>{item}</p>
                          </div>
                          <div
                            className="absolute inset-x-0 bottom-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                              backgroundColor: accentSecondary,
                            }}
                            aria-hidden="true"
                          />
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separator Line */}
      <div className={`${theme.bgSecondary}`}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className={`h-px bg-gray-100 dark:bg-gray-700 ${isDark ? 'opacity-50' : 'opacity-10'}`}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

