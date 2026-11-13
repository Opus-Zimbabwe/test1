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
  return (
    <section
      className="gc-statement-marquee"
      aria-label="Great Couples guiding values"
      tabIndex={0}
    >
      <div className="gc-statement-track" aria-hidden="true">
        {[...WORDS, ...WORDS].map((word, index) => (
          <span key={word + index} className="gc-statement-word">
            {word}
            <i>/</i>
          </span>
        ))}
      </div>
    </section>
  );
}
