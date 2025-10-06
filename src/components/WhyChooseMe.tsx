'use client';

const ADVANTAGES = [
	'فحص شامل قبل وبعد العمل للتأكد من الجودة',
	'ضمان 10 سنوات على أعمال حقن التربة',
	'فريق هندسي متخصص ومعتمد',
	'سرعة تنفيذ مع دقة عالية',
];

const WhyChooseMe = () => {
	return (
		<section id="advantages" className="bg-[#46250A] py-20 text-white">
			<div className="mx-auto max-w-6xl px-4 sm:px-6">
				<div className="rounded-[32px] border border-white/20 bg-[#2C1505] p-10">
					<div className="text-right">
						<span className="text-sm font-semibold tracking-[0.28em] text-white">
							لماذا تختار هامات يوناتيد؟
						</span>
						<h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
							موثوقية راسخة في حلول حقن التربة
						</h2>
						<p className="mt-3 text-base leading-relaxed text-white/80">
							نُعزز ثقة عملائنا بتقديم حلول متكاملة تجمع بين الخبرة الميدانية،
							التقنيات الحديثة، وسجلات الضمان المعتمد لضمان استدامة المشاريع.
						</p>
					</div>

					<div className="mt-10 grid gap-4 sm:grid-cols-2">
						{ADVANTAGES.map((item) => (
							<div
								key={item}
								className="flex items-center justify-start gap-3 rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-left"
							>
								<div className="h-2.5 w-2.5 rounded-full bg-white" />
								<p className="text-sm font-semibold leading-relaxed text-white text-left">
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