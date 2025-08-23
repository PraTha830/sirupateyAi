// Renders a read-only feed of chat I/O + an optional freeform note box
export default function NotesPanel({
  entries = [],             // [{ role:'user'|'assistant', text, ts }]
  showEditor = true,
  value = "",
  onChange = () => {},
}) {
  return (
    <section className="notes-panel" aria-label="Notes">
      {/* Conversation feed */}
      <div className="notes-feed">
        {entries.length === 0 ? (
          <div className="notes-empty">Chat here—your questions and answers will appear in this panel.</div>
        ) : (
          entries.map((m, i) => (
            <div key={i} className={`note-item ${m.role}`}>
              <div className="note-bubble">
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Optional freeform text box to jot personal notes */}
      {showEditor && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Capture notes, tasks, or reminders here…"
        />
      )}

      <style>{`
        .notes-panel { display: grid; gap: 12px; }
        .notes-feed {
          max-height: 260px;
          overflow: auto;
          padding: 10px;
          border-radius: 12px;
          background: var(--card);
          box-shadow: var(--shadow-1);
        }
        .notes-empty { color: var(--fg-muted); font-size: .95rem; }
        .note-item { display: flex; margin: 6px 0; }
        .note-item.user { justify-content: flex-end; }
        .note-item.assistant { justify-content: flex-start; }
        .note-bubble {
          max-width: 85%;
          padding: 10px 12px;
          border-radius: 10px;
          box-shadow: var(--shadow-1);
          background: color-mix(in oklab, var(--card), black 6%);
          color: var(--fg);
          white-space: pre-wrap;
        }
        .note-item.user .note-bubble {
          background: #22c1b633; /* light teal tint for user */
        }
        textarea {
          width: 100%;
          min-height: 120px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 2px solid color-mix(in oklab, var(--bg), white 12%);
          background: var(--bg);
          color: var(--fg);
          box-shadow: var(--shadow-1);
          resize: vertical;
        }
      `}</style>
    </section>
  );
}
