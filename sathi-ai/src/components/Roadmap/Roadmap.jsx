// src/components/Roadmap/Roadmap.jsx
import { useEffect, useState } from "react";

import MainPage from "../../layout/Mainpage";
import RightRail from "../common/RightRail";
import NotesPanel from "../common/NotesPanel";
import ChatDock from "../common/ChatDock";
import RoadmapCanvas from "./RoadmapCanvas";
import "./Roadmap.css";

/* --------- TEMP MOCK API (remove when you hook real endpoints) --------- */
// import { fetchRoadmap, updateRoadmap } from "../../api/roadmapApi";
// import { sendChat } from "../../api/chatApi";
const mock = {
  visa: {
    id: "rm-visa-1",
    stages: [
      { key: "now",    title: "Get I‑20, pay SEVIS", summary: "Collect I‑20; pay I‑901 SEVIS; prep docs.", links: [{ label: "SEVIS I‑901", url: "https://fmjfee.com/" }], status: "todo" },
      { key: "next",   title: "Book interview",      summary: "Complete DS‑160; pay MRV; schedule embassy interview.", links: [], status: "todo" },
      { key: "future", title: "Arrival & Status",    summary: "Orientation; full‑time; I‑94; SSN/Bank; maintain status.", links: [], status: "todo" }
    ]
  },
  career: {
    id: "rm-career-1",
    stages: [
      { key: "now",    title: "Resume baseline", summary: "One‑page resume; projects; LinkedIn.", links: [], status: "todo" },
      { key: "next",   title: "Applications",    summary: "Target roles; referrals; track apps.", links: [], status: "todo" },
      { key: "future", title: "CPT/OPT planning",summary: "CPT with DSO; OPT timeline; networking.", links: [], status: "todo" }
    ]
  }
};
async function fetchRoadmap() { return new Promise(r => setTimeout(() => r(mock), 200)); }
async function updateRoadmap() { return new Promise(r => setTimeout(() => r({ ok: true }), 150)); }
const tagMap = [
  { rx: /(sevis|i-901|i901)/i,            tag: "visa:SEVIS" },
  { rx: /(ds-160|ds160)/i,                tag: "visa:DS-160" },
  { rx: /(interview|consulate|embassy)/i, tag: "visa:Interview" },
  { rx: /\b(opt|cpt)\b/i,                 tag: "career:work-auth" },
  { rx: /(resume|cv)/i,                   tag: "career:resume" },
];
async function sendChat({ text }) {
  const tags = tagMap.filter(t => t.rx.test(text)).map(t => t.tag);
  const reply = tags.length
    ? `Great question! Tagged as ${tags.join(", ")} and updated your roadmap.`
    : `Thanks! I can help with SEVIS fees, DS‑160, interviews, CPT/OPT, resumes, and more.`;
  return new Promise(r => setTimeout(() => r({ reply, tags }), 250));
}
/* ---------------------------------------------------------------------- */

function Arrow() { return <div className="arrow">➜</div>; }

export default function RoadmapPage({ userId = "demo-user-1" }) {
  const [data, setData] = useState(null);

  // NEW: notes feed showing chat input/output
  const [entries, setEntries] = useState([]);
  const [freeNote, setFreeNote] = useState("");

  useEffect(() => {
    (async () => setData(await fetchRoadmap(userId)))();
  }, [userId]);

  const applyStageUpdate = async (laneKey, stageKey, patch) => {
    const next = structuredClone(data);
    Object.assign(next[laneKey].stages.find(s => s.key === stageKey), patch);
    setData(next);
    await updateRoadmap(next[laneKey].id, { stages: next[laneKey].stages });
  };

  const handleChat = async (text) => {
    // push user msg into notes feed
    setEntries(e => [...e, { role: "user", text, ts: Date.now() }]);

    const { reply, tags } = await sendChat({ text, userId, context: "roadmap" });

    // naive roadmap updates from detected tags
    tags?.forEach(t => {
      if (t.startsWith("visa:"))   applyStageUpdate("visa", "now",  { status: "in-progress" });
      if (t.startsWith("career:")) applyStageUpdate("career", "next", { status: "in-progress" });
    });

    // push assistant reply into notes feed
    setEntries(e => [...e, { role: "assistant", text: reply, ts: Date.now() }]);

    return reply;
  };

  if (!data) return <section style={{ padding: 24 }}>Loading…</section>;

  const rail = (
    <RightRail
      title="Saved Links"
      items={[
        { label: "SEVIS I‑901",     meta: "Payment", onClick: () => window.open("https://fmjfee.com/", "_blank") },
        { label: "DS‑160",          meta: "Form",    onClick: () => window.open("https://ceac.state.gov/CEAC/", "_blank") },
        { label: "Find US Embassy", meta: "Lookup",  onClick: () => window.open("https://www.usembassy.gov/", "_blank") },
      ]}
    />
  );

  return (
    <MainPage
      title="Roadmap"
      subtitle="Track your F‑1 visa process and career path. Cards update as you chat."
      headerRight={<div className="logo-circle">Logo</div>}
      main={<RoadmapCanvas data={data} onEdit={applyStageUpdate} Arrow={Arrow} />}
      rightRail={rail}
      // show chat transcript in NotesPanel; keep a freeform note box too
      notes={<NotesPanel entries={entries} value={freeNote} onChange={setFreeNote} />}
      chat={<ChatDock onSend={handleChat} />}
    />
  );
}
