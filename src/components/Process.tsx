'use client';

const STEPS = [
  {
    title: 'الفحص الأولي',
    description: 'دراسة الموقع وتحليل المعطيات الجيوتقنية لتحديد أفضل تقنيات الحقن المناسبة لنوع التربة ومستوى الخطورة.',
  },
  {
    title: 'تنفيذ حقن التربة',
    description: 'تشغيل معدات الحقن المتطورة وفق منهجيات موثقة تضمن توزيع المواد بدقة واستقرار التحميل.',
  },
  {
    title: 'فحص الجودة',
    description: 'مراجعة النتائج ميدانياً ومخبرياً، وقياس نسب الحقن ومؤشرات الاستقرار للتحقق من مطابقة المواصفات.',
  },
  {
    title: 'تسليم مع ضمان',
    description: 'تسليم تقارير فنية مع ضمان رسمي لمدة عشر سنوات يغطي الأعمال المنفذة وخطة المتابعة.',
  },
];

const Process = () => {
  return (
    <section id="process" className="bg-[#46250A] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-right">
          <span className="text-sm font-semibold tracking-[0.28em] text-white">خطوات العمل معنا</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">رحلة عمل واضحة ومطمئنة</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/80">
            نرافقكم من مرحلة تقييم الموقع وحتى التسليم بضمان رسمي، مع توفير تقارير دقيقة في كل مرحلة لضمان الشفافية والجودة.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-8"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-white/60" aria-hidden="true" />
              <div className="absolute top-4 left-4 text-sm font-semibold text-white/70" dir="ltr">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
