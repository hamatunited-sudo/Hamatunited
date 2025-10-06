'use client';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-[#46250A] via-[#2C1505] to-[#3d1c07] pt-40 pb-32 text-white"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#5d3516]/20 to-transparent blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[450px] w-[450px] rounded-full bg-gradient-to-tl from-[#46250A]/30 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-[-100px] h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="max-w-2xl text-right" dir="rtl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white">حلول هندسية معتمدة</p>
            <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl lg:text-[4rem]">
            أفضل شركة حقن تربة <br className="hidden sm:block" />في الدمام
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-white/90 sm:text-2xl">
            شركة هامات يوناتيد – خبرة طويلة في مجال حقن التربة والفحوصات الجيوتقنية.
          </p>
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/80">
                <svg className="h-4 w-4 text-[#6D3C1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-lg font-semibold text-white">فحص قبل وبعد التنفيذ للتأكد من الجودة</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white to-white/80">
                <svg className="h-4 w-4 text-[#6D3C1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-lg font-semibold text-white">ضمان 10 سنوات على الأعمال</p>
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
                            className="group rounded-2xl bg-gradient-to-br from-white to-white/90 px-10 py-4 text-base font-bold text-[#46250A] ring-2 ring-white/50 transition-all duration-300 hover:-translate-y-1 hover:ring-white active:scale-95"
            >
              <span className="flex items-center gap-2">
                تواصل مع خبيرنا الآن
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </span>
            </button>
          </div>
        </div>

          <div className="relative mx-auto grid max-w-lg gap-8 rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-10 text-right text-white backdrop-blur-xl ring-1 ring-white/10" dir="rtl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">ضمان الجودة</span>
              <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-bold leading-snug text-white">فحص شامل قبل وبعد التنفيذ</h2>
            <p className="text-base leading-relaxed text-white/90">
              فرقنا الهندسية تجري فحوصات مخبرية ميدانية دقيقة لضمان سلامة طبقات التربة، قوة التماسك، ونسب الحقن المثالية للمشاريع الصناعية والمدنية.
            </p>
          </div>
                    <div className="group relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative">
              <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold uppercase tracking-wider text-white">اتصل الآن</p>
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight" dir="ltr">
                +966 13 565 0006
              </p>
                        <p className="mt-4 text-base leading-relaxed text-white/90">
                فريق عمل جاهز للإجابة عن استفساراتكم وتقديم التقارير الفنية المعتمدة خلال 24 ساعة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;