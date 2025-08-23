import { useState } from 'react'

import LandingPage from "./LandingPage";

import Sidebar from "./components/Sidebar/Sidebar";
import './App.css'

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("chat");

  return (
    <div className="app" data-sidebar={collapsed ? "collapsed" : "expanded"}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        activeKey={active}
        onSelect={setActive}
      />
      <main className="app-main">
        <h1>current page: {active}</h1>
      </main>
    </div>
  );
}

export default App