'use client';

const SERVICES = [
  {
    title: 'الدراسات البيئية',
    description:
      'تحليل تأثير الأعمال على البيئة المحيطة وتقديم حلول التخفيف المعتمدة لضمان توافق المشاريع مع الاشتراطات التنظيمية.',
  },
  {
    title: 'اختبارات الصخور المعملية',
    description:
      'تقييم خصائص الصخور الميكانيكية والفيزيائية لتحديد قدرة التحمل والاستجابة لأعمال الحقن والاستقرار.',
  },
  {
    title: 'اختبارات التربة',
    description:
      'فحوصات معملية وميدانية شاملة على عينات التربة لتحديد الكثافة، نسبة الرطوبة، وقدرة التحمل قبل التنفيذ.',
  },
  {
    title: 'اختبارات الخرسانة',
    description:
      'قياس مقاومة الضغط، الانكماش، والنفاذية للتأكد من جودة الخرسانة وفق المواصفات السعودية والعالمية.',
  },
  {
    title: 'اختبارات الأسفلت',
    description:
      'تحليل الخلطات الأسفلتية وتقييم الالتصاق والاستقرار لضمان أداء مثالي لشبكات الطرق.',
  },
  {
    title: 'اختبارات المواد',
    description:
      'فحص شامل لمواد البناء والحقن للتأكد من مطابقتها للمعايير واعتمادها قبل الاستخدام في الموقع.',
  },
  {
    title: 'الاختبارات الجيوتقنية',
    description:
      'تنفيذ الاختبارات الجيوتقنية المتقدمة لتقييم خصائص التربة والصخور واختيار حلول الحقن الأنسب.',
  },
  {
    title: 'ضبط الجودة',
    description:
      'منظومة ضبط جودة ميدانية ومخبرية تضمن دقة التنفيذ وتوافق النتائج مع خطط المشروع المعتمدة.',
  },
  {
    title: 'فحص المشاريع وتقييمها',
    description:
      'إعداد تقارير تقييم هندسية للمشاريع القائمة مع تحديد المخاطر وإجراءات المعالجة والتأهيل.',
  },
  {
    title: 'المعايرة',
    description:
      'معايرة الأجهزة والمعدات المختبرية وفق جداول زمنية معتمدة للحفاظ على دقة القياسات والنتائج.',
  },
  {
    title: 'الاستطلاع',
    description:
      'تنفيذ أعمال الاستطلاع الموقعي ورفع البيانات الجيولوجية لدعم قرارات التصميم والتنفيذ.',
  },
  {
    title: 'التنقيب عن النفط',
    description:
      'خدمات مساندة لأعمال التنقيب عن النفط تشمل دعم فرق الحفر، مراقبة التربة، وتقييم المخاطر الجيولوجية.',
  },
];

const Services = () => {
  return (
    <section id="services" className="bg-[#46250A] py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-right">
          <span className="text-sm font-semibold tracking-[0.28em] text-white">خدماتنا</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">حلول متكاملة للحقن والفحوصات</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/80">
            نقدم مجموعة متكاملة من الخدمات المخبرية والميدانية لدعم مشاريع الحقن، تقوية الأساسات، وضبط الجودة في المشاريع الصناعية والمدنية، مع فريق هندسي معتمد وتجهيزات حديثة.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/10 p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <div className="relative z-10 text-right">
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
