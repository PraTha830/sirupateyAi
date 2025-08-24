import React, { useEffect, useState } from 'react';

/**
 * CareerPathPage.jsx
 * - Reads localStorage 'roadmapData' and 'onboardingData'
 * - Renders a mint-themed modern UI showing a career path timeline + phase cards
 * - Generates a fallback plan if roadmapData is missing or incomplete
 * - Minimal, dependency-free React component (works with CRA/Vite)
 */

/* Theme */
const palette = {
  mint: '#00D4AA',
  deepMint: '#00B389',
  navy: '#0f1724',
  cardBg: 'rgba(255,255,255,0.04)',
  softText: '#A7B1C2',
  lightBg: 'linear-gradient(180deg, rgba(237,255,250,0.06), rgba(237,255,250,0.02))',
  accent: '#7EE7C7'
};

/* Small util to generate fallback plan based on onboardingData */
function generateFallbackPlan(onboarding) {
  const goal = onboarding?.goalTitle || onboarding?.mainCareerGoal || 'Software Developer';
  const skills = onboarding?.skillsOfInterest?.length ? onboarding.skillsOfInterest : ['Programming'];
  const studyHours = parseInt(onboarding?.studyHoursPerWeek) || 8;

  // Create simple 4-phase plan
  return {
    title: `Roadmap to ${goal}`,
    summary: `A focused plan to reach ${goal} based on your selected skills and ${studyHours}h/week study commitment.`,
    phases: [
      {
        id: 'phase-1',
        name: 'Foundation',
        duration_weeks: 6,
        description: `Build fundamentals in ${skills.slice(0, 2).join(' & ') || skills[0]}.`,
        tasks: [
          `Complete 2 beginner courses on ${skills[0]}`,
          `Practice coding 3x per week (30–60 min)`,
          `Build 1 small project demonstrating basics`
        ]
      },
      {
        id: 'phase-2',
        name: 'Intermediate Projects',
        duration_weeks: 8,
        description: `Apply skills into projects and start specialized topics.`,
        tasks: [
          `Build 2 portfolio projects using ${skills.slice(0,2).join(' and ')}`,
          `Learn one framework or tooling commonly used in ${goal}`,
          `Write README + deploy one project`
        ]
      },
      {
        id: 'phase-3',
        name: 'Advanced Topics & Interview Prep',
        duration_weeks: 6,
        description: `Deepen understanding, prepare system design and interviews.`,
        tasks: [
          `Study system design basics or advanced algorithms depending on role`,
          `Solve 50 targeted interview problems`,
          `Mock interviews and resume polish`
        ]
      },
      {
        id: 'phase-4',
        name: 'Apply & Land Roles',
        duration_weeks: 6,
        description: `Target roles, network, apply, and track applications.`,
        tasks: [
          `Prepare 20 tailored applications`,
          `Network with alumni/LinkedIn daily`,
          `Iterate on failures and refine interview prep`
        ]
      }
    ],
    confidence_score: Math.min(90, 40 + skills.length * 10 + Math.min(30, studyHours)) // heuristic
  };
}

/* Simple badge */
const SkillBadge = ({ name }) => (
  <span className="skill-badge">{name}</span>
);

/* Roadmap phase card */
const PhaseCard = ({ phase, index, expanded, onToggle, onMarkTask }) => {
  return (
    <div className={`phase-card ${expanded ? 'expanded' : ''}`}>
      <div className="phase-head" onClick={() => onToggle(phase.id)}>
        <div className="phase-index">
          <div className="index-circle">{index + 1}</div>
        </div>
        <div className="phase-meta">
          <div className="phase-name">{phase.name}</div>
          <div className="phase-duration">{phase.duration_weeks ? `${phase.duration_weeks} weeks` : 'Flexible'}</div>
        </div>
        <div className="phase-actions">
          <button className="toggle-btn">{expanded ? 'Collapse' : 'Expand'}</button>
        </div>
      </div>

      {expanded && (
        <div className="phase-body">
          <p className="phase-desc">{phase.description}</p>
          <ol className="task-list">
            {phase.tasks?.map((t, i) => (
              <li key={i} className="task-item">
                <label className="task-label">
                  <input
                    type="checkbox"
                    onChange={(e) => onMarkTask(phase.id, i, e.target.checked)}
                    aria-label={`Mark task ${i + 1} for ${phase.name}`}
                  />
                  <span>{t}</span>
                </label>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default function CareerPathPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [taskState, setTaskState] = useState({}); // local tracking of completed tasks
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const rd = JSON.parse(localStorage.getItem('roadmapData'));
      const ob = JSON.parse(localStorage.getItem('onboardingData'));
      setOnboarding(ob || null);

      if (rd && (Array.isArray(rd.phases) || Array.isArray(rd.steps) || rd.plan)) {
        // Normalize: prefer rd.phases -> rd.steps -> rd.plan
        let normalized = null;
        if (Array.isArray(rd.phases)) {
          normalized = { title: rd.title || `Roadmap`, summary: rd.summary || '', phases: rd.phases, confidence_score: rd.confidence_score || rd.score || 75 };
        } else if (Array.isArray(rd.steps)) {
          normalized = { title: rd.title || `Roadmap`, summary: rd.summary || '', phases: rd.steps, confidence_score: rd.confidence_score || 75 };
        } else if (rd.plan && Array.isArray(rd.plan)) {
          normalized = { title: rd.title || `Roadmap`, summary: rd.summary || '', phases: rd.plan, confidence_score: rd.confidence_score || 75 };
        } else {
          // unknown shape - try to extract high-level info
          normalized = { title: rd.title || 'Roadmap', summary: rd.summary || '', phases: [] };
        }
        // Ensure each phase has id, name, tasks array
        normalized.phases = normalized.phases.map((p, idx) => ({
          id: p.id || `phase-${idx + 1}`,
          name: p.name || p.title || `Phase ${idx + 1}`,
          description: p.description || p.summary || '',
          duration_weeks: p.duration_weeks || p.duration || null,
          tasks: Array.isArray(p.tasks) ? p.tasks : (p.steps || p.items || []).map(String)
        }));
        setRoadmap(normalized);
      } else {
        // generate fallback plan
        const fallback = generateFallbackPlan(ob || {});
        setRoadmap(fallback);
      }
    } catch (err) {
      console.error('Failed to parse localStorage roadmap/onboarding', err);
      const fallback = generateFallbackPlan(null);
      setRoadmap(fallback);
    } finally {
      setLoading(false);
    }

    // Load saved task state if present
    const saved = localStorage.getItem('roadmap_task_state');
    if (saved) {
      try {
        setTaskState(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    // persist task state locally so progress survives refresh
    localStorage.setItem('roadmap_task_state', JSON.stringify(taskState));
  }, [taskState]);

  const togglePhase = (phaseId) => {
    setExpandedPhase(prev => (prev === phaseId ? null : phaseId));
  };

  const markTask = (phaseId, taskIndex, completed) => {
    setTaskState(prev => {
      const key = `${phaseId}`;
      const phaseTasks = new Set(prev[key] || []);
      if (completed) {
        phaseTasks.add(taskIndex);
      } else {
        phaseTasks.delete(taskIndex);
      }
      return { ...prev, [key]: Array.from(phaseTasks) };
    });
  };

  const overallProgress = () => {
    if (!roadmap?.phases?.length) return 0;
    let total = 0, done = 0;
    roadmap.phases.forEach(p => {
      const tasks = p.tasks || [];
      total += tasks.length;
      const completed = (taskState[p.id] || []).length;
      done += completed;
    });
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  };

  const openChat = () => {
    window.location.href = '/chat';
  };

  const exportJSON = () => {
    const payload = {
      roadmap,
      onboarding,
      taskState,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sathi-career-path-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="card centered">Loading your career path…</div>
        <style jsx>{`
          .page-wrap { min-height: 100vh; background: radial-gradient(circle at 10% 10%, rgba(0,212,170,0.06), transparent), ${palette.lightBg}; display:flex; align-items:center; justify-content:center; }
          .card.centered { background: ${palette.cardBg}; padding: 32px; border-radius: 12px; color: ${palette.softText}; box-shadow: 0 8px 30px rgba(2,6,23,0.6);}
        `}</style>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <header className="hero">
          <div>
            <h1 className="title">{roadmap?.title || 'Your Career Path'}</h1>
            <p className="subtitle">{roadmap?.summary || `A personalized plan based on your goals and skills.`}</p>

            <div className="meta-row">
              <div className="confidence">
                <div className="label">Confidence</div>
                <div className="score">{roadmap.confidence_score ?? 75}%</div>
              </div>

              <div className="progress">
                <div className="label">Progress</div>
                <div className="progress-bar-outer" aria-hidden>
                  <div className="progress-bar-inner" style={{ width: `${overallProgress()}%` }} />
                </div>
              </div>

              <div className="actions">
                <button className="btn primary" onClick={openChat}>Discuss in Chat</button>
                <button className="btn ghost" onClick={exportJSON}>Export JSON</button>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-top">
              <div className="avatar" aria-hidden>SA</div>
              <div className="profile-meta">
                <div className="user-name">{(onboarding && onboarding.fullName) || (onboarding && onboarding.email) || 'PraTha830'}</div>
                <div className="user-role">{onboarding?.goalTitle || onboarding?.mainCareerGoal || 'Your goal'}</div>
              </div>
            </div>
            <div className="skill-row">
              {(onboarding?.skillsOfInterest || []).slice(0,6).map(s => <SkillBadge key={s} name={s} />)}
            </div>
            <div className="card-footer soft">
              <div><strong>Study hrs / week:</strong> {onboarding?.studyHoursPerWeek || '—'}</div>
              <div><strong>Location:</strong> {onboarding?.country || onboarding?.timezone || '—'}</div>
            </div>
          </div>
        </header>

        <main className="main-grid">
          <section className="timeline-col">
            <div className="timeline-card">
              <h3 className="section-title">Career Phases</h3>
              <div className="phase-list">
                {roadmap.phases.map((p, idx) => (
                  <PhaseCard
                    key={p.id}
                    phase={p}
                    index={idx}
                    expanded={expandedPhase === p.id}
                    onToggle={togglePhase}
                    onMarkTask={markTask}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="insights-col">
            <div className="insights-card">
              <h3 className="section-title">Career Insights</h3>
              <div className="insight">
                <div className="insight-title">Top focus skill</div>
                <div className="insight-body">{(onboarding?.skillsOfInterest?.[0]) || 'Programming'}</div>
              </div>

              <div className="insight">
                <div className="insight-title">Estimated time to first role</div>
                <div className="insight-body">{Math.max(3, Math.round( (roadmap.phases.reduce((s,p) => s + (p.duration_weeks||0),0) || 20) / 4 ))} months</div>
              </div>

              <div className="insight">
                <div className="insight-title">Next action</div>
                <div className="insight-body">{roadmap.phases?.[0]?.tasks?.[0] || 'Start the first task in Phase 1'}</div>
              </div>

              <div className="divider" />

              <h4 className="section-title small">Target Skills</h4>
              <div className="skill-cloud">
                {(onboarding?.skillsOfInterest?.length ? onboarding.skillsOfInterest : ['Programming','Problem Solving']).map(s => <SkillBadge key={s} name={s} />)}
                {/* show some suggested adjacent skills */}
                <SkillBadge name="Git" />
                <SkillBadge name="Testing" />
                <SkillBadge name="Communication" />
              </div>
            </div>

            <div className="insights-card">
              <h3 className="section-title">Progress Tracking</h3>
              <div className="track">
                <div className="track-row">
                  <div className="track-label">Overall progress</div>
                  <div className="track-value">{overallProgress()}%</div>
                </div>
                <div className="small-note">Tasks you complete are saved locally in your browser.</div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <style jsx>{`
        :root { --mint: ${palette.mint}; --deepMint: ${palette.deepMint}; --navy: ${palette.navy}; --cardBg: ${palette.cardBg}; --softText: ${palette.softText}; --accent: ${palette.accent}; }
        .page-wrap {
          min-height: 100vh;
          background: linear-gradient(180deg, rgba(0,212,170,0.06), rgba(0,212,170,0.01));
          padding: 40px;
          box-sizing: border-box;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: white;
        }
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .title { font-size: 28px; margin: 0 0 8px 0; background: linear-gradient(90deg,var(--mint), #67f0c2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: var(--softText); margin: 0 0 16px 0; max-width: 640px; }
        .meta-row { display:flex; gap:16px; align-items:center; flex-wrap:wrap; }
        .confidence { background: rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px; min-width:110px; }
        .confidence .label { color: var(--softText); font-size:12px; }
        .confidence .score { font-size:16px; font-weight:700; color: var(--mint); margin-top:4px; }
        .progress { min-width:260px; }
        .progress .label { color: var(--softText); font-size:12px; }
        .progress-bar-outer { width: 220px; height:10px; background: rgba(255,255,255,0.06); border-radius:999px; overflow:hidden; margin-top:6px; }
        .progress-bar-inner { height:100%; background: linear-gradient(90deg,var(--mint), var(--deepMint)); border-radius:999px; transition: width 350ms ease; }
        .actions { display:flex; gap:8px; align-items:center; }
        .btn { padding:10px 14px; border-radius:10px; border: none; cursor:pointer; font-weight:600; font-size:14px; }
        .btn.primary { background: linear-gradient(90deg,var(--mint), var(--deepMint)); color: #042028; box-shadow: 0 8px 30px rgba(0, 180, 140, 0.12); }
        .btn.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: var(--softText); }

        .profile-card { background: var(--cardBg); padding:16px; border-radius:12px; width:260px; box-shadow: 0 10px 30px rgba(2,6,23,0.5); }
        .profile-top { display:flex; gap:12px; align-items:center; margin-bottom:12px; }
        .avatar { width:52px; height:52px; border-radius:12px; background: linear-gradient(180deg, var(--mint), var(--deepMint)); display:flex; align-items:center; justify-content:center; color:#042028; font-weight:800; font-size:16px; }
        .profile-meta .user-name { font-weight:700; color: white; }
        .profile-meta .user-role { font-size:13px; color: var(--softText); }
        .skill-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
        .card-footer.soft { color: var(--softText); font-size:13px; display:flex; justify-content:space-between; gap:8px; }

        .main-grid { display:grid; grid-template-columns: 1fr 320px; gap: 20px; align-items:start; }
        .timeline-card, .insights-card { background: var(--cardBg); border-radius:12px; padding:16px; box-shadow: 0 10px 30px rgba(2,6,23,0.45); }
        .section-title { margin:0 0 12px 0; color: white; font-size:16px; }

        .phase-list { display:flex; flex-direction:column; gap:12px; }
        .phase-card { background: rgba(255,255,255,0.02); border-radius:12px; padding:12px; transition: transform 160ms ease, box-shadow 160ms ease; border: 1px solid rgba(255,255,255,0.03); }
        .phase-card.expanded { box-shadow: 0 12px 30px rgba(2,6,23,0.5); transform: translateY(-4px); }

        .phase-head { display:flex; gap:12px; align-items:center; cursor:pointer; }
        .phase-index { width:44px; display:flex; align-items:center; justify-content:center; }
        .index-circle { width:36px; height:36px; border-radius:10px; background: rgba(255,255,255,0.03); display:flex; align-items:center; justify-content:center; color: var(--mint); font-weight:800; }
        .phase-meta { flex:1; }
        .phase-name { font-weight:700; color: white; }
        .phase-duration { color: var(--softText); font-size:13px; margin-top:4px; }
        .phase-actions { }
        .toggle-btn { background: transparent; color: var(--mint); border: none; font-weight:700; cursor:pointer; }

        .phase-body { margin-top:12px; border-top: 1px dashed rgba(255,255,255,0.03); padding-top:12px; }
        .phase-desc { color: var(--softText); margin:0 0 8px 0; }
        .task-list { margin:0; padding-left: 18px; color: var(--softText); }
        .task-item { margin-bottom:8px; }
        .task-label { display:flex; align-items:center; gap:10px; cursor:pointer; }
        .task-label input { width:16px; height:16px; accent-color: var(--mint); cursor:pointer; }

        .insight { margin-bottom:12px; color: var(--softText); }
        .insight-title { font-weight:700; color: white; margin-bottom:6px; }
        .skill-cloud { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }

        .skill-badge { display:inline-block; background: linear-gradient(90deg,var(--mint), var(--accent)); color: #042028; padding:6px 10px; border-radius:999px; font-weight:700; font-size:13px; }

        .track { padding:8px 0; }
        .track-row { display:flex; justify-content:space-between; align-items:center; color: var(--softText); }
        .small-note { color: var(--softText); font-size:12px; margin-top:8px; }

        /* responsive */
        @media (max-width: 992px) {
          .main-grid { grid-template-columns: 1fr; }
          .hero { flex-direction: column; align-items:stretch; gap:16px; }
          .profile-card { width:100%; }
        }
      `}</style>
    </div>
  );
}