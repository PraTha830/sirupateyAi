import { Fragment } from "react";
import StageCard from "./StageCard";

export default function Lane({ title, stages, laneKey, onEdit, Arrow }) {
  const order = ["now", "next", "future"];
  const labelFor = (k) => (k === "now" ? "Now" : k === "next" ? "Next" : "Future");

  return (
    <div className="lane">
      <h2 className="lane-title">{title}</h2>

      <div className="lane-row">
        {order.map((key, i) => (
          <Fragment key={key}>
            {/* Card column */}
            <div className="lane-cell">
              <div className={`lane-label ${key}`}>{labelFor(key)}</div>
              <StageCard
                laneKey={laneKey}
                stageKey={key}
                data={stages.find((s) => s.key === key)}
                onEdit={(patch) => onEdit(key, patch)}
              />
            </div>

            {/* Middle arrow column */}
            {i < order.length - 1 && (
              <div className="arrow-cell" aria-hidden="true">
                {Arrow ? <Arrow /> : <div className="arrow">➜</div>}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
