'use client';

import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#1f5c48] bg-[#0f3327] text-white">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#0d2d24] via-[#134333]/95 to-[#0f3327]"></div>
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-8 sm:grid-cols-3 lg:gap-12">
          <div className="text-right space-y-6">
            <div className="relative h-16 w-48">
              <Image
                src="/HAMAT logo_White.svg"
                alt="شعار شركة هامات يوناتيد"
                fill
                sizes="192px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <p className="text-base leading-relaxed text-[#d9ece5]">
              أفضل شركة حقن تربة في المنطقة الشرقية بخبرة هندسية معتمدة وضمان رسمي لمدة عشر سنوات على الأعمال المنفذة.
            </p>
          </div>
          <div className="text-right space-y-4">
            <h4 className="text-xl font-bold text-white">روابط سريعة</h4>
            <div className="space-y-3">
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right text-[#d9ece5] transition-transform duration-200 hover:-translate-x-1 hover:text-white"
              >
                من نحن
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right text-[#d9ece5] transition-transform duration-200 hover:-translate-x-1 hover:text-white"
              >
                خدماتنا
              </button>
              <button
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right text-[#d9ece5] transition-transform duration-200 hover:-translate-x-1 hover:text-white"
              >
                خطوات العمل
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right text-[#d9ece5] transition-transform duration-200 hover:-translate-x-1 hover:text-white"
              >
                اتصل بنا
              </button>
              <a
                href="https://www.hamatex.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-right text-[#d9ece5] transition-transform duration-200 hover:-translate-x-1 hover:text-white"
              >
                موقعنا الرسمي
              </a>
            </div>
          </div>
          <div className="text-right space-y-4">
            <h4 className="text-xl font-bold text-white">تواصل معنا</h4>
            <ul className="space-y-4">
              <li>
                الهاتف: <a href="tel:+966135650006" className="font-semibold text-white hover:text-[#8dd7c0]" dir="ltr">+966 13 565 0006</a>
              </li>
              <li>
                البريد الإلكتروني: <a href="mailto:info@hamatex.com" className="text-white transition-colors hover:text-[#8dd7c0]">info@hamatex.com</a>
              </li>
              <li>
                الموقع: <a href="https://www.hamatex.com" className="text-white transition-colors hover:text-[#8dd7c0]" target="_blank" rel="noopener noreferrer">www.hamatex.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-[#1f5c48] pt-4 pb-2">
          <div className="flex w-full justify-center">
            <p className="text-center text-base text-[#d9ece5]">
              © جميع الحقوق محفوظة لشركة هامات يوناتيد – المنطقة الشرقية
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
