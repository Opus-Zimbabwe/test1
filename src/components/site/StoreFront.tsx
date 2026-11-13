import { useState } from "react";
import { Search, ArrowDown, ArrowUpRight } from "lucide-react";
import { useSignedImageUrl, type Book } from "@/lib/db";
function ExhibitCover({ book, index }: { book: Book; index: number }) {
  const url = useSignedImageUrl(book.cover_url, "book-covers");
  return url ? (
    <img src={url} alt="" style={{ "--book-offset": index } as React.CSSProperties} />
  ) : null;
}
export function StoreIntro({ books }: { books: Book[] }) {
  const covers = books.filter((b) => !!b.cover_url).slice(0, 3);
  return (
    <section className="gc-store-intro">
      <div>
        <h1>
          A new chapter.
          <br />
          <span>For both of you.</span>
        </h1>
        <p>
          Books and resources to grow your marriage, deepen your faith and keep the conversation
          going.
        </p>
        <a href="#collection">
          Explore the collection <ArrowDown size={18} />
        </a>
      </div>
      <div className="gc-store-exhibit" aria-hidden="true">
        {covers.length ? (
          covers.map((book, i) => <ExhibitCover key={book.id} book={book} index={i} />)
        ) : (
          <div className="gc-store-paper">
            <span>
              Great
              <br />
              Couples.
            </span>
            <span>
              Read.
              <br />
              Reflect.
              <br />
              Grow.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
export function StoreCollection({
  books,
  loading,
  renderBook,
}: {
  books: Book[];
  loading: boolean;
  renderBook: (book: Book) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "print" | "digital">("all");
  const matches = books.filter(
    (b) =>
      `${b.title} ${b.author}`.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "all" || (filter === "digital" ? !!b.file_url : !b.file_url)),
  );
  return (
    <section id="collection" className="gc-store-collection">
      <div className="gc-store-toolbar">
        <h2>The collection.</h2>
        <label className="gc-store-search">
          <Search size={19} />
          <span className="sr-only">Search resources</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a book or author"
          />
        </label>
      </div>
      <div className="gc-store-filters" aria-label="Filter resources">
        {(["all", "print", "digital"] as const).map((f) => (
          <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "All resources" : f === "print" ? "Print books" : "Digital editions"}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="gc-store-loading" role="status">
          Loading the collection…
        </p>
      ) : matches.length ? (
        <div className="gc-store-book-grid">{matches.map(renderBook)}</div>
      ) : (
        <div className="gc-store-empty">
          <h3>{books.length ? "Nothing here yet." : "The next chapter is coming."}</h3>
          <p>
            {books.length
              ? "Try a different search or browse all resources."
              : "Our team is preparing the collection. Get in touch for available books and resources."}
          </p>
          {books.length ? (
            <button
              onClick={() => {
                setFilter("all");
                setQuery("");
              }}
            >
              Show all resources
            </button>
          ) : (
            <a href="mailto:greatcouplestrust@gmail.com">
              Ask about our resources <ArrowUpRight size={18} />
            </a>
          )}
        </div>
      )}
    </section>
  );
}
