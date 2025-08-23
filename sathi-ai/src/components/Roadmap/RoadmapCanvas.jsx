import Lane from "./Lane";

export default function RoadmapCanvas({ data, onEdit, Arrow }) {
  return (
    <div className="roadmap-grid">
      <Lane
        title="Visa Process"
        laneKey="visa"
        stages={data.visa.stages}
        Arrow={Arrow}
        onEdit={(stageKey, patch) => onEdit("visa", stageKey, patch)}
      />
      <Lane
        title="Career"
        laneKey="career"
        stages={data.career.stages}
        Arrow={Arrow}
        onEdit={(stageKey, patch) => onEdit("career", stageKey, patch)}
      />
    </div>
  );
}
