const WORDS = [
  "Faith",
  "Family",
  "Marriage",
  "Restoration",
  "Community",
  "Empowerment",
  "Excellence",
  "Integrity",
  "Christ-centered",
];

export function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-b border-primary/8 bg-white py-5 sm:pt-16 sm:pb-5">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {items.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-flex items-center gap-8 text-[.68rem] font-bold uppercase tracking-[.18em] text-primary/65"
          >
            {word}
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
