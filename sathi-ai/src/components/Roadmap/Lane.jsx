import StageCard from "./StageCard";

export default function Lane({ title, stages, laneKey, onEdit, Arrow }) {
  const order = ["now", "next", "future"];

  return (
    <div className="lane">
      <h2 className="lane-title">{title}</h2>
      <div className="lane-row">
        {order.map((key, i) => (
          <div key={key} className="lane-cell">
            <div className={`lane-label ${key}`}>{key === "now" ? "Now" : key === "next" ? "Next" : "Future"}</div>
            <StageCard
              laneKey={laneKey}
              stageKey={key}
              data={stages.find(s => s.key === key)}
              onEdit={(patch) => onEdit(key, patch)}
            />
            {i < order.length - 1 && (Arrow ? <Arrow /> : <div />)}
          </div>
        ))}
      </div>
    </div>
  );
}
