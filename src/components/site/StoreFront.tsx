import { useState, useEffect } from "react";
import { Search, ArrowDown, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { useSignedImageUrl, type Book } from "@/lib/db";
function DisplayBook({
  book,
  position,
  selected,
  onSelect,
}: {
  book: Book;
  position: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const url = useSignedImageUrl(book.cover_url, "book-covers");
  return (
    <button
      className={`gc-display-book${selected ? " is-selected" : ""}`}
      style={{ "--display-position": position } as React.CSSProperties}
      onClick={onSelect}
      aria-label={`Feature ${book.title}`}
      aria-pressed={selected}
    >
      {url ? <img src={url} alt={`${book.title} cover`} /> : <span>{book.title}</span>}
      <i aria-hidden="true" />
    </button>
  );
}
export function StoreIntro({ books }: { books: Book[] }) {
  const [index, setIndex] = useState(0);
  const featured = books[index % Math.max(books.length, 1)];
  useEffect(() => {
    if (index >= books.length) setIndex(0);
  }, [index, books.length]);
  const step = (direction: number) =>
    setIndex((value) => (value + direction + books.length) % books.length);
  return (
    <section className="gc-store-intro gc-reading-room">
      <div className="gc-reading-copy">
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
          Find your next chapter <ArrowDown size={20} />
        </a>
      </div>
      <div className="gc-reading-display">
        <span className="gc-reading-word" aria-hidden="true">
          READ
        </span>
        <div className="gc-store-exhibit gc-book-stage" aria-label="Featured books">
          {books.length ? (
            books.map((book, i) => (
              <DisplayBook
                key={book.id}
                book={book}
                position={i - index}
                selected={i === index}
                onSelect={() => setIndex(i)}
              />
            ))
          ) : (
            <div className="gc-reading-empty">
              <span>
                Stories that
                <br />
                bring us closer.
              </span>
            </div>
          )}
          <div className="gc-reading-plinth" aria-hidden="true" />
        </div>
        {featured && (
          <div className="gc-featured-caption" aria-live="polite">
            <div>
              <h2>
                <a href={`#book-${featured.id}`}>{featured.title}</a>
              </h2>
              <p>{featured.author}</p>
            </div>
            {books.length > 1 && (
              <div className="gc-featured-controls">
                <button onClick={() => step(-1)} aria-label="Previous featured book">
                  <ArrowLeft size={21} />
                </button>
                <button onClick={() => step(1)} aria-label="Next featured book">
                  <ArrowRight size={21} />
                </button>
              </div>
            )}
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
