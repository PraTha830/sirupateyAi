import { useState } from "react";

export default function StageCard({ laneKey, stageKey, data, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(data.summary || "");
  const save = () => { onEdit({ summary }); setEditing(false); };

  const color =
    stageKey === "now" ? "amber" :
    stageKey === "next" ? "green" : "cyan";

  return (
    <div className={`stage-card stage-${color} ${data.status || "todo"}`}>
      {!editing ? (
        <>
          <div className="stage-top">
            <strong>{data.title || (stageKey === "now" ? "Get I‑20 + SEVIS" : stageKey === "next" ? "Visa Interview" : "Arrival & Compliance")}</strong>
            <span className={`badge ${data.status || "todo"}`}>{data.status || "todo"}</span>
          </div>
          <p className="summary">{summary || "Add notes or steps…"}</p>
          <div className="links">
            {(data.links || []).map((l, i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
          <div className="actions">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onEdit({ status: data.status === "done" ? "todo" : "done" })}>
              {data.status === "done" ? "Mark To‑Do" : "Mark Done"}
            </button>
          </div>
        </>
      ) : (
        <div className="edit">
          <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={4} />
          <div className="actions">
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
