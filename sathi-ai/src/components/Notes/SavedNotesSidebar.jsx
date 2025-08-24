import { useMemo, useState } from "react";
import "./SavedNotesSidebar.css";

/**
 * Sidebar listing saved notes.
 *
 * Props:
 * - notes:       [{ id, title, content, tags }]
 * - selectedId:  string|null
 * - onSelect:    (id) => void
 * - onNew:       () => void
 * - onDelete:    (id) => void
 */
export default function SavedNotesSidebar({
  notes = [],
  selectedId = null,
  onSelect = () => {},
  onNew = () => {},
  onDelete = () => {},
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return notes;
    return notes.filter((n) => {
      const hay =
        `${n.title ?? ""} ${n.content ?? ""} ${(n.tags ?? []).join(" ")}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, notes]);

  return (
    <aside className="sn-shell" aria-label="Saved Notes">
      <div className="sn-head">
        <h3>Saved Notes</h3>
        <button className="sn-new" onClick={onNew} title="New note">
          ➕
        </button>
      </div>

      <div className="sn-search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search notes…"
          aria-label="Search notes"
        />
      </div>

      <div className="sn-list" role="list">
        {filtered.length === 0 && (
          <div className="sn-empty">No notes found.</div>
        )}

        {filtered.map((n) => {
          const firstLine = (s) => (s || "").split(/\r?\n/).find(Boolean) || "";
          const primary = firstLine(n.title) || firstLine(n.content) || "Untitled";
          const meta = (n.tags ?? []).join(", ");
          const active = n.id === selectedId;
          return (
            <div
              key={n.id}
              role="listitem"
              className={`sn-item ${active ? "active" : ""}`}
            >
              <button
                type="button"
                className="sn-open"
                onClick={() => onSelect(n.id)}
                title={primary}
                aria-current={active ? "true" : undefined}
              >
                <div className="sn-title">{primary}</div>
                {meta && <div className="sn-meta">{meta}</div>}
              </button>

              <button
                type="button"
                className="sn-del"
                onClick={() => onDelete(n.id)}
                aria-label="Delete note"
                title="Delete"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
