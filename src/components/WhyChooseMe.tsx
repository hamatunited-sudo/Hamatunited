'use client';

const ADVANTAGES = [
	'فحص شامل قبل وبعد العمل للتأكد من الجودة',
	'ضمان 10 سنوات على أعمال حقن التربة',
	'فريق هندسي متخصص ومعتمد',
	'سرعة تنفيذ مع دقة عالية',
];

const WhyChooseMe = () => {
	return (
		<section id="advantages" className="bg-white py-20 text-[#134333]">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="rounded-[32px] border border-[#1f5c48] bg-[#134333] p-10 shadow-[0_26px_60px_rgba(19,67,51,0.3)]">
					<div className="text-right">
						<span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold tracking-[0.28em] text-white">
							لماذا تختار هامات يوناتيد؟
						</span>
						<h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
							موثوقية راسخة في حلول حقن التربة
						</h2>
						<p className="mt-3 text-base leading-relaxed text-[#d9ece5]">
							نُعزز ثقة عملائنا بتقديم حلول متكاملة تجمع بين الخبرة الميدانية،
							التقنيات الحديثة، وسجلات الضمان المعتمد لضمان استدامة المشاريع.
						</p>
					</div>

					<div className="mt-10 grid gap-4 sm:grid-cols-2">
						{ADVANTAGES.map((item) => (
							<div
								key={item}
								className="flex items-center justify-start gap-3 rounded-3xl border border-white/15 bg-[#1f5c48] px-6 py-5 text-left shadow-[0_18px_40px_rgba(19,67,51,0.35)]"
							>
								<div className="h-2.5 w-2.5 rounded-full bg-white" />
								<p className="text-left text-sm font-semibold leading-relaxed text-white">
									{item}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyChooseMe;