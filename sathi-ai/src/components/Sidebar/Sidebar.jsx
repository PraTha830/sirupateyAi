import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({
  items = [
    { key: "chat",     label: "Mitra Chat",     icon: "💬" },
    { key: "notes",    label: "Note Taker",     icon: "📝" },
    { key: "reminder", label: "Reminder",       icon: "⏰" },
  
    { key: "career",   label: "Career Planner", icon: "🎯" },
    { key: "roadmap",  label: "Roadmap",        icon: "🗺️" },
    { key: "tips",     label: "Tips & Tricks",  icon: "💡" },
  ],
  activeKey = "chat",
  onSelect = () => {},
  className = "",
  collapsed = false,
  onToggle = () => {},
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside
      className={`sb-shell ${collapsed ? "collapsed" : ""} ${className}`}
      aria-label="Sidebar Navigation"
    >
      {/* collapse / expand */}
      <button
        className="sb-toggle"
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggle}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? "▶" : "◀"}
      </button>

      {items.map((it) => {
        const active = it.key === activeKey;
        return (
          <button
            key={it.key}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(it.key)}
            className={`sb-item ${active ? "sb-item--active" : ""}`}
            title={collapsed ? it.label : undefined}
          >
            <span className="sb-item-icon" aria-hidden>{it.icon}</span>
            <span className="sb-item-text">{it.label}</span>
          </button>
        );
      })}

      <div className="sb-spacer" />

      <div className="sb-settings-tray">
        {/* Pop-up menu */}
        <div className={`sb-menu ${settingsOpen ? "open" : ""}`}>
          {[
            { k: "profile",  label: "Profile",  icon: "👤" },
            { k: "settings", label: "Settings", icon: "⚙️" },
            { k: "logout",   label: "Log out",  icon: "↪"  },
          ].map((m, idx) => (
            <div key={m.k} className={`sb-menu-row ${settingsOpen ? "in" : ""}`} style={{ ["--i"]: idx }}>
              <button
                type="button"
                className="sb-menu-btn"
                aria-label={m.label}
                onClick={() => { alert(`${m.label} clicked`); setSettingsOpen(false); }}
              >
                <span aria-hidden>{m.icon}</span>
              </button>
              {!collapsed && <span className="sb-menu-label">{m.label}</span>}
            </div>
          ))}
        </div>

        {/* FAB */}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={settingsOpen}
          title="Open settings"
          className={`sb-fab ${settingsOpen ? "open" : ""}`}
          onClick={() => setSettingsOpen((s) => !s)}
        >
          ⋮
        </button>
      </div>
    </aside>
  );
}
