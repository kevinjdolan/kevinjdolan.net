import { useEffect, useState } from "react";
import { getArchive } from "../lib/api";
import { fallbackArchive } from "../lib/content";
import type { ArchiveItem } from "../types";

function ArchiveRow({ item }: { item: ArchiveItem }) {
  return (
    <a className="archive-item" href={`/archive/${item.slug}/`} onClick={(event) => event.preventDefault()}>
      <span className="date">{item.date}</span>
      <span className="archive-copy">
        <span className="title">{item.title}</span>
        <span className="preview">{item.preview}</span>
      </span>
      <span className="meta">{item.meta}</span>
    </a>
  );
}

export function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>(fallbackArchive);

  useEffect(() => {
    let cancelled = false;

    getArchive()
      .then((nextItems) => {
        if (!cancelled) setItems(nextItems);
      })
      .catch(() => {
        if (!cancelled) setItems(fallbackArchive);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="archive-page active" id="view-archive">
      <h1>Archive</h1>
      <p className="lede">Notes, essays, and field reports on agents, evaluations, and the messier parts of building with LLMs.</p>
      <div className="archive-list">
        {items.map((item) => (
          <ArchiveRow key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
