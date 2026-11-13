import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, RefreshCw, ArrowUpRight, BookOpen } from "lucide-react";
import { useBooks, useSignedImageUrl, type Book } from "@/lib/db";
function CatalogueBook({ book }: { book: Book }) {
  const cover = useSignedImageUrl(book.cover_url, "book-covers");
  return (
    <article className="gc-admin-book">
      <div className="gc-admin-book-cover">
        {cover ? <img src={cover} alt={`${book.title} cover`} /> : <BookOpen size={40} />}
      </div>
      <div>
        <span className="gc-admin-book-status">{book.active ? "Published" : "Not published"}</span>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <strong>
          {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
            book.price_usd,
          )}
        </strong>
        <p>
          {book.file_url ? "Digital edition" : "Print edition"} · {book.stock} in stock
        </p>
        <p className="gc-admin-book-description">{book.description}</p>
      </div>
    </article>
  );
}
export function AdminBooks() {
  const { rows, loading, refresh, error } = useBooks();
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const books = rows.filter(
    (book) =>
      (!activeOnly || book.active) &&
      `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="gc-admin-books">
      <div className="gc-admin-video-heading">
        <div>
          <h2>Books & resources</h2>
          <p>Review the current catalogue, covers, prices and stock.</p>
        </div>
        <Link to="/auth" className="gc-admin-primary">
          Manage books & orders <ArrowUpRight size={18} />
        </Link>
      </div>
      <p className="gc-admin-books-access">
        Book changes and orders use your bookshop account sign-in.
      </p>
      <div className="gc-admin-video-tools">
        <label className="gc-admin-video-search">
          <Search size={18} />
          <input
            aria-label="Search books"
            placeholder="Search title or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="gc-admin-hidden">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Published only
        </label>
        <button onClick={refresh} className="gc-admin-refresh">
          <RefreshCw size={17} />
          Refresh
        </button>
        <Link to="/store" className="gc-admin-refresh">
          View store <ArrowUpRight size={17} />
        </Link>
      </div>
      {error && (
        <p role="alert" className="gc-admin-video-warning">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading catalogue…</p>
      ) : books.length ? (
        <div className="gc-admin-book-grid">
          {books.map((book) => (
            <CatalogueBook key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="gc-admin-video-empty">
          {rows.length
            ? "No books match your search."
            : "No books are available in this content source."}
        </p>
      )}
    </section>
  );
}
