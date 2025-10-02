/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';
import { getThemeClasses } from '@/lib/theme-utils';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);

  const { language, content } = useLanguage();
  const footerContent = (content as any).footer ?? {};
  const contentAny = content as any;
  const brand = (footerContent as any).brand ?? {};
  const contactInfo = (footerContent as any)[language]?.contactInfo ?? (footerContent as any).ar?.contactInfo ?? {};
  const titles = (footerContent as any).titles ?? { ar: {}, en: {} };
  const isRTL = language === 'ar';
  const copyrightText = (footerContent as any)?.copyright ?? contentAny.common?.[language]?.copyright ?? '';
  const brandName = brand.name ?? contentAny.common?.[language]?.logo ?? contentAny.common?.ar?.logo ?? '';
  const quickLinksTitle = titles[language]?.quickLinks ?? titles.ar?.quickLinks ?? '';
  const servicesTitle = titles[language]?.services ?? titles.ar?.services ?? '';
  const contactTitle = titles[language]?.contact ?? titles.ar?.contact ?? '';
  const emailLabel = titles[language]?.emailLabel ?? titles.ar?.emailLabel ?? '';
  const phoneLabel = titles[language]?.phoneLabel ?? titles.ar?.phoneLabel ?? '';
  const locationLabel = titles[language]?.locationLabel ?? titles.ar?.locationLabel ?? '';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  type QuickLink = { label: string; id: string };
  const quickLinks: QuickLink[] = ((footerContent as any)[language]?.quickLinks ?? (footerContent as any).ar?.quickLinks ?? []).map((label: string, idx: number) => ({ label, id: ['home','about','services','faq'][idx] }));

  const services = ((content as any).services?.[language] ?? (content as any).services?.ar ?? []).map((service: any) => {
    let title = (service?.title ?? '') as string;
    if (language === 'ar') {
      title = title.replace(/^\s*خدمة(?:[:\-\u2013\u2014])?\s*/u, '');
    }
    return title;
  });

  return (
    <footer className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'} ${isDark ? 'text-white' : theme.textPrimary}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`flex flex-col md:flex-row md:items-start gap-8`}>

          <div className="flex-none md:order-1">
            <div className="flex justify-start lg:justify-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={isDark ? (brand.logoDark ?? "/Logo_white.png") : (brand.logoLight ?? "/Logo.png")}
                alt={brandName}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>

          <div className={`${isRTL ? 'text-right md:ml-20' : 'text-left md:mr-20'} flex-none max-w-max ${isRTL ? 'md:order-2' : 'md:order-3'}`}>
            <h4 className="text-lg font-semibold mb-3 lg:mb-6" style={{ color: '#50B7AF' }}>{quickLinksTitle}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link: QuickLink) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className={`${isDark ? 'text-gray-300 hover:text-[#2a8891]' : 'text-gray-600 hover:text-[#1e666c]'} transition-colors text-sm block`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={`flex-1 ${isRTL ? 'text-right md:ml-12' : 'text-left md:mr-12'} ${isRTL ? 'md:order-3' : 'md:order-2'}`}>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#50B7AF' }}>{servicesTitle}</h4>
            <ul className="columns-1 sm:columns-2 list-none p-0 m-0 space-y-3">
              {services.map((service: any, index: number) => (
                <li key={index} className={`break-inside-avoid ${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm flex items-start gap-2`}>
                  <span style={{ color: '#50B7AF' }} className="mt-1 font-bold">•</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1 md:order-4`}>
            <h4 className="text-lg font-semibold mb-6" style={{ color: '#50B7AF' }}>{contactTitle}</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="font-semibold" style={{ color: '#50B7AF' }}>{emailLabel}</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold" style={{ color: '#50B7AF' }}>{phoneLabel}</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`} dir="ltr">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold" style={{ color: '#50B7AF' }}>{locationLabel}</span>
                <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} mt-6 pt-4 pb-0`}>
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm text-center`}>
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
