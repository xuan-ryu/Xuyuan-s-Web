import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="text-eyebrow">404</span>
      <h1 className="mt-6 text-display text-6xl md:text-8xl">Not here.</h1>
      <p className="mt-4 text-ink-muted max-w-md">
        The page you&apos;re looking for doesn&apos;t exist — or hasn&apos;t been
        built yet. Try the work index instead.
      </p>
      <Link
        href="/work"
        className="mt-10 inline-flex items-center gap-3 border border-ink px-6 py-3 text-eyebrow hover:bg-ink hover:text-bg transition-colors"
      >
        See the work
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
