import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./LandingPage";

import Sidebar from "./components/Sidebar/Sidebar";
import MainPage from "./layout/Mainpage";                       // ✅
import RightRail from "./components/common/RightRail";          // ✅
import NotesPanel from "./components/common/NotesPanel";        // ✅
import ChatDock from "./components/common/ChatDock";            // ✅
import RoadmapPage from "./components/Roadmap/Roadmap";         // ✅ uses  Roadmap.jsx

import "./App.css";
import "./index.css";
import "./layout/layout.css";                                   // ✅ layout css
import "./components/Roadmap/Roadmap.css";                      // ✅ roadmap css

// ⬇️  Existing app UI, unchanged — just wrapped into AppShell
function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("chat"); // "chat" | "notes" | "reminder" | "calendar" | "career" | "roadmap" | "tips"

  const rail = (
    <RightRail
      title={active === "notes" ? "Saved Notes" : "Quick Links"}
      items={[
        { label: "SEVIS I‑901",  meta: "Payment", onClick: () => window.open("https://fmjfee.com/", "_blank") },
        { label: "DS‑160",       meta: "Form",    onClick: () => window.open("https://ceac.state.gov/CEAC/", "_blank") },
        { label: "US Embassies", meta: "Lookup",  onClick: () => window.open("https://www.usembassy.gov/", "_blank") },
      ]}
    />
  );

  return (
    <div className="app" data-sidebar={collapsed ? "collapsed" : "expanded"}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        activeKey={active}
        onSelect={setActive}
      />

      <main className="app-main">
        {active === "roadmap" && <RoadmapPage userId="demo-user-1" />}

        {active !== "roadmap" && (
          <MainPage
            title={
              active === "chat" ? "Sathi Chat" :
              active === "notes" ? "Note Taker" :
              active === "reminder" ? "To‑Dos / Reminders" :
              active === "calendar" ? "Calendar" :
              active === "career" ? "Career Planner" :
              active === "tips" ? "Tips & Tricks" : active
            }
            subtitle={
              active === "chat"
                ? "Ask questions about visas, careers, or campus life."
                : "Reusable page shell — replace the main area with your component."
            }
            headerRight={<div className="logo-circle">Logo</div>}
            main={
              <section
                className="stage-card stage-cyan"
                style={{ minHeight: 280, display: "grid", placeItems: "center" }}
              >
                <div style={{ textAlign: "center" }}>
                  <h2 style={{ margin: 0, textTransform: "capitalize" }}>
                    {active.replace("-", " ")}
                  </h2>
                  <p className="muted" style={{ marginTop: 6 }}>
                    (Put the {active} page’s main component here)
                  </p>
                </div>
              </section>
            }
            rightRail={rail}
            notes={<NotesPanel />}
            chat={
              <ChatDock
                onSend={async (text) =>
                  `You are on the "${active}" page. I received: "${text}"`
                }
              />
            }
          />
        )}
      </main>
    </div>
  );
}

// ⬇️ New router layer: "/" → LandingPage, "/chat" → AppShell
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<AppShell />} />
        {/* Optional: redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
