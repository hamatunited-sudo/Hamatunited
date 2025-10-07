'use client';

const STEPS = [
  {
    title: 'الفحص الأولي لإختبار GPR',
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
    description: 'تسليم تقارير فنية مع ضمان رسمي لمدة عشر سنوات يغطي الأعمال المنفذة.',
  },
];

const Process = () => {
  return (
    <section id="process" className="bg-white py-20 text-[#134333]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-right">
          <span className="text-sm font-semibold tracking-[0.28em] text-[#0f3327]">خطوات العمل معنا</span>
          <h2 className="mt-3 text-3xl font-bold text-[#134333] sm:text-4xl">رحلة عمل واضحة ومطمئنة</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#3b6c5c]">
            نرافقكم من مرحلة تقييم الموقع وحتى التسليم بضمان رسمي، مع توفير تقارير دقيقة في كل مرحلة لضمان الشفافية والجودة.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-[28px] border border-[#1f5c48] bg-[#134333] p-8 shadow-lg"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-white/25" aria-hidden="true" />
              <div className="absolute top-4 left-4 text-sm font-semibold text-[#d9ece5]" dir="ltr">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#e3f2ed]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
