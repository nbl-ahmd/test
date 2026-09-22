/**
 * Two threads crossing over-under to form a stylised "w" — the Domweave mark.
 * Inherits `currentColor` so it adapts to the header's paper/dark themes.
 */
export default function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Under-thread, broken where the over-thread crosses it. */}
      <path d="M2.5 6 L7.5 18 L10.5 10.8" />
      <path d="M11.1 9.4 L12.5 6" />
      {/* Over-thread. */}
      <path d="M9 6 L14 18 L19 6" />
    </svg>
  );
}
