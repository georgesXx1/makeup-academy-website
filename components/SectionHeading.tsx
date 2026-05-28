type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#b97866]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold text-[#151313] md:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-[#6c5851]">{description}</p>
    </div>
  );
}
