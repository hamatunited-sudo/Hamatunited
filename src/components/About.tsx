'use client';

const About = () => {
  return (
    <section id="about" className="bg-white py-28 text-[#134333]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[40px] border border-[#1f5c48] bg-[#134333] p-12 shadow-[0_28px_70px_rgba(19,67,51,0.35)]">
          <div className="flex flex-col gap-8 text-right">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 shadow-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">من نحن</span>
              </div>
              <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">شركة هامات يوناتيد</h2>
            </div>
            <p className="text-lg leading-relaxed text-[#d9ece5]">
              شركة هامات يوناتيد من الشركات الرائدة في خدمات حقن التربة بالمنطقة الشرقية، بخبرة واسعة في الاختبارات الجيوتقنية والمعملية. نعمل وفق المعايير المحلية والدولية لنضمن سلامة المشاريع واستدامتها من خلال تقنيات الحقن الدقيقة، وفحوصات مختبرية ميدانية معتمدة، وتقارير هندسية موثقة.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#1f5c48] via-[#1a4d3c] to-[#1f5c48] p-8 shadow-[0_24px_50px_rgba(19,67,51,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_60px_rgba(19,67,51,0.45)]">
                <div className="absolute inset-0 bg-gradient-to-tl from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/20 to-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">خبرة ميدانية موثوقة</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#e3f2ed]">
                    أكثر من عشر سنوات في مشاريع حقن التربة، تعزيز الأساسات، ومعالجة الهبوطات، مع سجل نجاح في القطاعات الصناعية، السكنية، والبنية التحتية.
                  </p>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#216551] via-[#1f5c48] to-[#1a4d3c] p-8 shadow-[0_20px_45px_rgba(19,67,51,0.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_rgba(19,67,51,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 to-white/5 shadow-[0_8px_16px_rgba(0,0,0,0.1)] backdrop-blur-sm">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">تقارير فنية معتمدة</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#e3f2ed]">
                    فرق الاختبارات المعتمدة لدينا تقدم تقارير شفافة قبل العمل وبعده، مصحوبة بمعايير الجودة المطلوبة لتوثيق أعمال الحقن والفحص.
                  </p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border border-dashed border-white/25 bg-gradient-to-br from-[#1f5c48]/90 via-[#1a4d3c]/80 to-[#1f5c48]/90 p-8 text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-[0_20px_45px_rgba(19,67,51,0.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/80"></div>
                  <h3 className="text-lg font-semibold text-white">التزامنا</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#e3f2ed]">
                  نلتزم بتقديم حلول هندسية متكاملة تبدأ من دراسة الموقع مرورًا بتنفيذ عمليات الحقن ووصولًا إلى التسليم بضمان رسمي لمدة عشر سنوات، لضمان استقرار مشاريع عملائنا على المدى الطويل.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

