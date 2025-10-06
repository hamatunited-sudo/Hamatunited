'use client';

const About = () => {
  return (
    <section id="about" className="bg-[#46250A] py-28 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="rounded-[40px] border-2 border-white/20 bg-gradient-to-br from-[#2C1505] to-[#1a0d03] p-12 backdrop-blur-xl ring-1 ring-white/10">
          <div className="flex flex-col gap-8 text-right">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white">من نحن</span>
              </div>
              <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">شركة هامات يوناتيد</h2>
            </div>
            <p className="text-lg leading-relaxed text-white/80">
              شركة هامات يوناتيد من الشركات الرائدة في خدمات حقن التربة بالدمام، بخبرة واسعة في الاختبارات الجيوتقنية والمعملية. نعمل وفق المعايير المحلية والدولية لنضمن سلامة المشاريع واستدامتها من خلال تقنيات الحقن الدقيقة، وفحوصات مختبرية ميدانية معتمدة، وتقارير هندسية موثقة.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="group rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:-translate-y-1">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white to-white/80">
                  <svg className="h-6 w-6 text-[#6D3C1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white">خبرة ميدانية موثوقة</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  أكثر من عشر سنوات في مشاريع حقن التربة، تعزيز الأساسات، ومعالجة الهبوطات، مع سجل نجاح في القطاعات الصناعية، السكنية، والبنية التحتية.
                </p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/5 p-6">
                <h3 className="text-xl font-semibold text-white">تقارير فنية معتمدة</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  فرق الاختبارات المعتمدة لدينا تقدم تقارير شفافة قبل العمل وبعده، مصحوبة بمعايير الجودة المطلوبة لتوثيق أعمال الحقن والفحص.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-dashed border-white/40 bg-white/10 p-6 text-white/85">
              <h3 className="text-lg font-semibold text-white">التزامنا</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                نلتزم بتقديم حلول هندسية متكاملة تبدأ من دراسة الموقع مرورًا بتنفيذ عمليات الحقن ووصولًا إلى التسليم بضمان رسمي لمدة عشر سنوات، لضمان استقرار مشاريع عملائنا على المدى الطويل.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

