'use client';

import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#2C1505] to-[#1a0d03] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
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
            <p className="text-base leading-relaxed text-white/80">
              أفضل شركة حقن تربة في الدمام بخبرة هندسية معتمدة وضمان رسمي لمدة عشر سنوات على الأعمال المنفذة.
            </p>
          </div>
          <div className="text-right space-y-4">
            <h4 className="text-xl font-bold text-white">روابط سريعة</h4>
            <div className="space-y-3">
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right transition-opacity hover:opacity-80"
              >
                من نحن
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right transition-opacity hover:opacity-80"
              >
                خدماتنا
              </button>
              <button
                onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right transition-opacity hover:opacity-80"
              >
                خطوات العمل
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="block w-full text-right transition-opacity hover:opacity-80"
              >
                اتصل بنا
              </button>
            </div>
          </div>
          <div className="text-right space-y-4">
            <h4 className="text-xl font-bold text-white">تواصل معنا</h4>
            <ul className="space-y-4">
              <li>
                الهاتف: <a href="tel:+966135650006" className="text-white font-semibold" dir="ltr">+966 13 565 0006</a>
              </li>
              <li>
                البريد الإلكتروني: <a href="mailto:info@hamatex.com" className="text-white hover:underline">info@hamatex.com</a>
              </li>
              <li>
                الموقع: <a href="https://www.hamatex.com" className="text-white hover:underline" target="_blank" rel="noopener noreferrer">www.hamatex.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 border-t border-white/10 pt-4 pb-2">
          <div className="flex w-full justify-center">
            <p className="text-base text-white/70 text-center">
              © جميع الحقوق محفوظة لشركة هامات يوناتيد – الدمام
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
