'use client';

import { useState, useEffect } from 'react';

interface ContentField {
  key: string;
  labelAr: string;
  labelEn: string;
  type: 'text' | 'textarea';
  ar: string;
  en: string;
}

interface ContentSection {
  id: string;
  nameAr: string;
  nameEn: string;
  fields: ContentField[];
}

interface AdminContent {
  [sectionId: string]: {
    [fieldKey: string]: {
      ar: string;
      en: string;
    };
  };
}

export const useAdminContent = () => {
  const [content, setContent] = useState<AdminContent>({});
  const [isLoading, setIsLoading] = useState(true);

  const defaultContent: AdminContent = {
    header: {
      title: {
        ar: 'محمد للاستشارات المهنية',
        en: 'Mohammed Career Consultations'
      },
      subtitle: {
        ar: 'نحو مستقبل مهني أفضل',
        en: 'Towards a Better Professional Future'
      }
    },
    hero: {
      title: {
        ar: 'ابدأ رحلتك نحو\nالنجاح المهني',
        en: 'Start Your Journey\nTowards Professional Success'
      },
      description: {
        ar: 'احصل على استشارات مهنية متخصصة من خبير معتمد لتطوير مسارك المهني وتحقيق أهدافك',
        en: 'Get specialized professional consultations from a certified expert to develop your career path and achieve your goals'
      },
      primaryButtonText: {
        ar: 'احجز الآن',
        en: 'Book Now'
      },
      secondaryButtonText: {
        ar: 'تواصل معنا',
        en: 'Contact Us'
      }
    },
    about: {
      title: {
        ar: 'عن محمد',
        en: 'About Mohammed'
      },
      description: {
        ar: 'خبير استشارات مهنية معتمد بخبرة تزيد عن 5 سنوات في مساعدة الأفراد على تطوير مسارهم المهني',
        en: 'Certified career consultant with over 5 years of experience helping individuals develop their professional path'
      }
    },
    services: {
      title: {
        ar: 'خدماتي المهنية',
        en: 'My Professional Services'
      },
      subtitle: {
        ar: 'اختر الخدمة المناسبة لاحتياجاتك المهنية',
        en: 'Choose the service that fits your professional needs'
      }
    },
    contact: {
      title: {
        ar: 'تواصل معي',
        en: 'Contact Me'
      },
      subtitle: {
        ar: 'دعنا نبدأ رحلتك المهنية معاً',
        en: "Let's start your professional journey together"
      },
      phone: {
        ar: '+966 57 080 9098',
        en: '+966 57 080 9098'
      },
      email: {
        ar: 'contact@mohcareer.com',
        en: 'contact@mohcareer.com'
      }
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        // Try to load from admin-saved content first
        const adminContent = localStorage.getItem('mohcareer_content');
        if (adminContent) {
          const parsedSections: ContentSection[] = JSON.parse(adminContent);
          const convertedContent: AdminContent = {};
          
          parsedSections.forEach(section => {
            convertedContent[section.id] = {};
            section.fields.forEach(field => {
              convertedContent[section.id][field.key] = {
                ar: field.ar,
                en: field.en
              };
            });
          });
          
          setContent(convertedContent);
          setIsLoading(false);
          return;
        }

        // Fallback to original format
        const originalContent = localStorage.getItem('mohcareer_original_content');
        if (originalContent) {
          const parsed = JSON.parse(originalContent);
          const convertedContent: AdminContent = {};
          
          Object.keys(parsed.ar).forEach(sectionId => {
            convertedContent[sectionId] = {};
            Object.keys(parsed.ar[sectionId]).forEach(fieldKey => {
              convertedContent[sectionId][fieldKey] = {
                ar: parsed.ar[sectionId][fieldKey],
                en: parsed.en[sectionId][fieldKey]
              };
            });
          });
          
          setContent(convertedContent);
        } else {
          setContent(defaultContent);
        }
      } catch (error) {
        console.error('Error loading admin content:', error);
        setContent(defaultContent);
      }
      
      setIsLoading(false);
    };

    loadContent();

    // Listen for storage changes (when admin saves)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mohcareer_content' || e.key === 'mohcareer_original_content') {
        loadContent();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // defaultContent is static

  const getContent = (section: string, field: string, language: 'ar' | 'en'): string => {
    return content[section]?.[field]?.[language] || defaultContent[section]?.[field]?.[language] || '';
  };

  return {
    content,
    getContent,
    isLoading
  };
};

export default useAdminContent;
