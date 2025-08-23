export default function RightRail({ title = "", items = [] }) {
  return (
    <div className="rail">
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div className="rail__stack">
        {items.map((it, i) => (
          <button key={i} className="rail__card" onClick={it.onClick}>
            <div className="rail__cardTitle">{it.label}</div>
            {it.meta && <div className="rail__meta">{it.meta}</div>}
          </button>
        ))}
      </div>
      <style>{`
        .rail__stack { display: grid; gap: 12px; }
        .rail__card {
          text-align: left;
          padding: 12px 14px;
          border-radius: 10px;
          border: none;
          background: var(--card);
          color: var(--fg);
          box-shadow: var(--shadow-2);
          cursor: pointer;
        }
        .rail__cardTitle { font-weight: 600; }
        .rail__meta { font-size: 12px; color: var(--fg-muted); margin-top: 4px; }
      `}</style>
    </div>
  );
}
