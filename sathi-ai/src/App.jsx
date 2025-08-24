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
import RoadmapPage from "./components/Roadmap/Roadmap";         // ✅ uses  Roadmap.jsx (existing)
import CareerPathPage from "./components/Career/CareerPathPage"; // ✅ Career Path UI
import ReminderPage from "./components/Reminder/ReminderPage";   // ✅ Reminder System
import TipsPage from "./components/Tips/TipsPage";               // ✅ Smart Tips Dashboard
import MitraChat from "./components/Chat/MitraChat";            // ✅ NEW: Friendly Chat Interface
import Notes from "./components/Notes/Notes";
import OnboardingPage from "./components/Onboarding/OnboardingPage";     // ✅ Fixed import

import "./App.css";
import "./index.css";
import "./layout/layout.css";                                   // ✅ layout css
import "./components/Roadmap/Roadmap.css";                      // ✅ roadmap css


// ⬇️  Existing app UI, unchanged — just wrapped into AppShell
function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("chat"); // "chat" | "notes" | "reminder" | "calendar" | "career" | "roadmap" | "tips"

  return (
    <div className="app" data-sidebar={collapsed ? "collapsed" : "expanded"}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        activeKey={active}
        onSelect={setActive}
      />

      <main className="app-main">
        {active === "notes" && <Notes userId="user_123" />}
        {active === "roadmap" && <RoadmapPage userId="demo-user-1" />}
        {active === "career" && <CareerPathPage />}
        {active === "reminder" && <ReminderPage />}
        {active === "tips" && <TipsPage />}
        {active === "chat" && <MitraChat />} {/* Use MitraChat for chat tab */}

        {active !== "roadmap" && active !== "notes" && active !== "career" && 
         active !== "reminder" && active !== "tips" && active !== "chat" && (
          <MainPage
            title={
              active === "chat" ? "Mitra Chat" : // Changed to "Mitra Chat" as requested
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
                    (Put the {active} page's main component here)
                  </p>
                </div>
              </section>
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
        <Route path="/onboarding" element={<OnboardingPage />} />
        {/* Optional: redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}