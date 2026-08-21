import Link from "next/link";
export default function Projects() {
  return (
    <main className="py-20 max-w-7xl mx-auto px-6">
      <p className="text-primary text-[.8rem] font-semibold uppercase tracking-[.12em]">
        Our work
      </p>
      <h1 className="text-4xl font-bold text-dark mt-3">Selected Projects</h1>
      <p className="mt-4 max-w-2xl">
        Digital work created for organisations building what matters.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <article className="bg-muted rounded-[26px] p-7">
          <h2 className="text-2xl font-bold text-dark">
            Great Couples International Trust
          </h2>
          <p className="mt-3">
            A public website for an organisation focused on strengthening
            couples and families.
          </p>
          <a
            className="inline-flex text-primary font-semibold mt-6"
            href="https://greatcouples.org.zw"
            target="_blank"
            rel="noreferrer"
          >
            Visit website →
          </a>
        </article>
        <article className="bg-muted rounded-[26px] p-7">
          <h2 className="text-2xl font-bold text-dark">
            Prime Property Investment & Development Group
          </h2>
          <p className="mt-3">
            A digital presence for a property investment and development
            organisation.
          </p>
          <a
            className="inline-flex text-primary font-semibold mt-6"
            href="https://primepidg.co.zw"
            target="_blank"
            rel="noreferrer"
          >
            Visit website →
          </a>
        </article>
      </div>
    </main>
  );
}
