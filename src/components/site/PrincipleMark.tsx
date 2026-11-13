export function PrincipleMark({ kind }: { kind: "care" | "faith" | "community" }) {
  return (
    <svg viewBox="0 0 48 48" className="gc-principle-mark" aria-hidden="true">
      {kind === "care" ? (
        <>
          <path
            fill="currentColor"
            d="M24 37C16 32 8 25 8 18a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 7-8 14-16 19Z"
          />
          <path
            d="M18 22c2 2 3 3 6 3s4-1 6-3"
            fill="none"
            stroke="#e81957"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </>
      ) : kind === "faith" ? (
        <>
          <rect x="20" y="8" width="8" height="27" rx="3" fill="currentColor" />
          <rect x="12" y="15" width="24" height="8" rx="3" fill="currentColor" />
          <rect x="11" y="37" width="26" height="5" rx="2.5" fill="currentColor" />
        </>
      ) : (
        <>
          <circle cx="24" cy="15" r="6" fill="currentColor" />
          <circle cx="10" cy="20" r="4.5" fill="currentColor" />
          <circle cx="38" cy="20" r="4.5" fill="currentColor" />
          <path
            d="M13 37v-4a11 11 0 0 1 22 0v4a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3ZM3 35v-3a7 7 0 0 1 8-7 15 15 0 0 0-2 8v5H6a3 3 0 0 1-3-3ZM45 35v-3a7 7 0 0 0-8-7 15 15 0 0 1 2 8v5h3a3 3 0 0 0 3-3Z"
            fill="currentColor"
          />
        </>
      )}
    </svg>
  );
}
