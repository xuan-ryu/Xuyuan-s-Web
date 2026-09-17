import { about } from "@/data/about";
import { Cta } from "@/components/ui/cta";
import styles from "./about-travel-note.module.css";

// About page — a quiet L1 note linking the personal Off Hours material to
// an encrypted travel record. It reveals that a notebook exists, but none of
// the private itinerary is present in this component or the public markup.
export function AboutTravelNote() {
  const note = about.travelJournal;

  return (
    <aside className={styles.note} data-fade aria-labelledby="travel-note-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{note.eyebrow}</p>
        <h3 className={styles.title} id="travel-note-title">
          {note.title}
        </h3>
        <p className={styles.body}>{note.body}</p>
      </div>
      <Cta
        className={styles.action}
        variant="quiet"
        href={note.href}
        prefetch={false}
      >
        {note.cta}
      </Cta>
    </aside>
  );
}
