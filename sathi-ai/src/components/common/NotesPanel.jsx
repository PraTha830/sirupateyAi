export default function NotesPanel({
  entries = [],
  showEditor = true,
  value = "",
  onChange = () => {},
}) {
  return (
    <section className="notes-panel" aria-label="Notes">
      <div className="notes-feed">
        {entries.length === 0 ? (
          <div className="notes-empty">
            Chat here—your questions and answers will appear in this panel.
          </div>
        ) : (
          entries.map((m, i) => (
            <div key={i} className={`note-item ${m.role}`}>
              <div className="note-bubble">{m.text}</div>
            </div>
          ))
        )}
      </div>

      <style>{`
        /* Fixed above the ChatDock at the bottom, centered */
        .notes-panel {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 90px;                 /* sits just above the dock */
          width: min(1100px, 96vw);     /* same width as dock for alignment */
          z-index: 40;
          display: grid;
          gap: 12px;
          pointer-events: none;         /* allow page clicks; feed itself keeps pointer */
        }
        .notes-feed {
          pointer-events: auto;
          max-height: 320px;            /* taller preview */
          overflow: auto;
          padding: 12px;
          border-radius: 14px;
          background: var(--card);
          box-shadow: var(--shadow-2);
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
        .note-item.user .note-bubble { background: #22c1b633; }
      `}</style>
    </section>
  );
}
