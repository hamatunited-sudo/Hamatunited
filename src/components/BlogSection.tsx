'use client';

const BlogSection = () => {
  return (
    <section id="blog" className="bg-white py-20 text-[#134333]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-[32px] border border-[#1f5c48] bg-[#134333] p-10 text-right shadow-[0_26px_60px_rgba(19,67,51,0.28)]">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">قسم المدونة</h2>
          <p className="mt-3 text-base leading-relaxed text-[#d9ece5]">
            للاطلاع على المزيد من المقالات والأخبار المتعلقة بحقن التربة، الاختبارات الجيوتقنية، وأحدث مشاريعنا الميدانية يمكنكم زيارة المدونة والاطلاع على الحالات العملية والتقارير المتخصصة.
          </p>
          <div className="mt-8 flex justify-end">
            <a
              href="https://www.geosoillab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(19,67,51,0.4)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              زيارة المدونة
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
