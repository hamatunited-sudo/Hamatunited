'use client';

const ContactSection = () => {
  return (
    <section id="contact" className="bg-[#46250A] py-20 text-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-[32px] border border-white/20 bg-[#2C1505] p-10 text-right shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">اتصل بنا</h2>
          <p className="mt-3 text-base leading-relaxed text-white/80">
            يسعدنا استقبال استفساراتكم وطلباتكم على مدار الأسبوع. فريق خدمة العملاء والفريق الهندسي جاهزون لتقديم الاستشارة الأولية وترتيب الزيارات الميدانية.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">الهاتف</h3>
              <a
                href="tel:+966135650006"
                className="mt-2 block text-base font-semibold text-white"
                dir="ltr"
              >
                +966 13 565 0006
              </a>
              <p className="mt-3 text-sm text-white/80">واتساب متاح للتواصل الفوري.</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">البريد الإلكتروني</h3>
              <a
                href="mailto:info@hamatex.com"
                className="mt-2 block text-base font-semibold text-white"
              >
                info@hamatex.com
              </a>
              <p className="mt-3 text-sm text-white/80">نرد خلال يوم عمل واحد مع تحديد المتطلبات الفنية.</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">الموقع الإلكتروني</h3>
              <a
                href="https://www.hamatex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-base font-semibold text-white"
              >
                www.hamatex.com
              </a>
              <p className="mt-3 text-sm text-white/80">تجدون تفاصيل الخدمات والتقارير الفنية عبر موقعنا الرسمي.</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <h3 className="text-lg font-semibold text-white">الموقع على الخريطة</h3>
              <a
                href="https://maps.google.com/?q=Hamat+United+Dammam"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
              >
                اضغط هنا لعرض الموقع
              </a>
              <p className="mt-3 text-sm text-white/80">الدمام – المملكة العربية السعودية.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
