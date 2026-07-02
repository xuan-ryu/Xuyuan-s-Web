import { Cta } from "@/components/ui/cta";

// Uses the semantic system (label atom + Cta) rather than Tailwind utilities —
// the utility theme tokens this page once referenced never existed, so the old
// markup rendered unstyled and its hover made the link text invisible.
export default function NotFound() {
  return (
    <section className="not-found">
      <span className="label">404</span>
      <h1>Not here.</h1>
      <p>
        The page you&apos;re looking for doesn&apos;t exist — or hasn&apos;t been
        built yet. Try the work index instead.
      </p>
      <Cta href="/work" variant="solid">
        See the work
      </Cta>
    </section>
  );
}
