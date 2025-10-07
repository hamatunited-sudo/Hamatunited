'use client';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-white via-[#f1f7f4] to-[#e7f2ee] pt-40 pb-32 text-[#134333]"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
  <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#134333]/15 to-transparent blur-3xl" />
  <div className="absolute bottom-[-200px] right-[-120px] h-[450px] w-[450px] rounded-full bg-gradient-to-tl from-[#134333]/12 to-transparent blur-3xl" />
  <div className="absolute top-1/2 left-[-100px] h-[300px] w-[300px] rounded-full bg-[#134333]/6 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-2xl text-right" dir="rtl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#134333]/20 bg-white/80 px-4 py-2 backdrop-blur-sm shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0f3327]">حلول هندسية معتمدة</p>
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#134333]"></span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[#134333] sm:text-5xl md:text-6xl lg:text-[4rem]">
            أفضل شركة حقن تربة <br className="hidden sm:block" />في المنطقة الشرقية
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-[#3b6c5c] sm:text-2xl">
            شركة هامات يوناتيد – خبرة طويلة في مجال حقن التربة والفحوصات الجيوتقنية.
          </p>
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-[#d3e3dd] bg-white/95 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[#f1f7f4]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#134333]/10">
                <svg className="h-4 w-4 text-[#134333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
                <p className="text-lg font-semibold text-[#134333]">فحص قبل وبعد التنفيذ للتأكد من الجودة</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-[#d3e3dd] bg-white/95 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-[#f1f7f4]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#134333]/10">
                <svg className="h-4 w-4 text-[#134333]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
                <p className="text-lg font-semibold text-[#134333]">ضمان 10 سنوات</p>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:justify-start">
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group rounded-2xl bg-[#134333] px-10 py-4 text-base font-bold text-white shadow-[0_15px_35px_rgba(19,67,51,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0f3327] hover:shadow-[0_18px_40px_rgba(19,67,51,0.3)] active:scale-95"
            >
              <span className="flex items-center gap-2">
                تواصل مع خبيرنا الآن
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </span>
            </button>
          </div>
        </div>

          <div className="relative mx-auto grid max-w-lg gap-8 rounded-3xl border border-[#d3e3dd] bg-white p-10 text-right text-[#134333] shadow-[0_24px_60px_rgba(19,67,51,0.1)]" dir="rtl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d3e3dd] bg-[#f1f7f4] px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#0f3327]">ضمان الجودة</span>
              <div className="h-2 w-2 rounded-full bg-[#134333] animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold leading-snug text-[#134333]">فحص شامل قبل وبعد التنفيذ</h2>
            <p className="text-base leading-relaxed text-[#3b6c5c]">
              فرقنا الهندسية تجري فحوصات مخبرية ميدانية دقيقة لضمان سلامة طبقات التربة، قوة التماسك، ونسب الحقن المثالية للمشاريع الصناعية والمدنية.
            </p>
          </div>
        <div className="group relative overflow-hidden rounded-3xl border border-[#d3e3dd] bg-[#f8fbf9] p-8 text-[#134333] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(19,67,51,0.18)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#134333]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative">
              <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold uppercase tracking-wider text-[#0f3327]">اتصل الآن</p>
                          <svg className="h-5 w-5 text-[#134333]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              </div>
              <div className="mt-4">
                <a
                  href={`https://wa.me/966135650006?text=${encodeURIComponent('مرحبًا، أود الاستفسار عن خدمات حقن التربة.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-2xl bg-[#134333] px-5 py-3 text-base font-bold text-white shadow-[0_10px_30px_rgba(19,67,51,0.12)] transition-all duration-200 hover:brightness-95"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M20.52 3.48A11.947 11.947 0 0012 0C5.373 0 0 5.373 0 12c0 2.115.552 4.095 1.602 5.86L0 24l6.547-1.656A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12 0-3.197-1.248-6.158-3.48-8.52z" fill="#134333"/>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.272-.099-.47-.149-.669.149-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.884-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.134.298-.347.447-.521.149-.174.198-.298.297-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347z" fill="#fff"/>
                  </svg>
                  تواصل عبر واتساب
                </a>
                <p className="mt-4 text-base leading-relaxed text-[#3b6c5c]">
                  فريق عمل جاهز للإجابة عن استفساراتكم وتقديم التقارير الفنية المعتمدة خلال 24 ساعة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;