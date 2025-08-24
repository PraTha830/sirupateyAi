import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Turn-taking voice assistant:
 * - press "Start" once to begin auto turns, or hold-to-talk manually
 * - user speaks -> STT -> send to /assistant/chat -> TTS -> play -> listen again
 * - requires Chrome/Edge for Web Speech API (webkitSpeechRecognition)
 */
export default function TurnVoiceAssistant() {
  // ======= config =======
  const API_BASE = "http://127.0.0.1:8000";
  const AUTH_URL = `${API_BASE}/auth/token`;
  const TTS_URL = `${API_BASE}/tts`;
  const ASSIST_URL = `${API_BASE}/assistant/chat`; // <-- change if your route differs
  const USER_ID = "user_123";
  const VOICE = "Rachel";
  const MODEL_ID = "eleven_turbo_v2";

  // ======= state =======
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || "");
  const [mode, setMode] = useState("idle"); // idle | listening | thinking | speaking | error
  const [autoTurns, setAutoTurns] = useState(true);
  const [err, setErr] = useState("");

  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");
  const [history, setHistory] = useState([]); // {role:'user'|'assistant', text:string}[]

  const audioRef = useRef(null);
  const recRef = useRef(null);
  const stopRecRef = useRef(() => {});
  const mountedRef = useRef(false);

  // ======= token bootstrap =======
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (token) return;
      try {
        const r = await fetch(AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: USER_ID }),
        });
        if (!r.ok) throw new Error("token fetch failed");
        const j = await r.json();
        if (!cancelled) {
          localStorage.setItem("access_token", j.access_token);
          setToken(j.access_token);
        }
      } catch (e) {
        if (!cancelled) {
          setErr("Could not get auth token");
          setMode("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // ======= STT (Web Speech API) helpers =======
  const sttSupported = useMemo(() => {
    return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  }, []);

  function buildRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    // for turn-taking we prefer non-continuous — it stops when you pause
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    return rec;
  }

  async function startListening() {
    if (!sttSupported) {
      setErr("Speech recognition not supported in this browser.");
      setMode("error");
      return;
    }
    if (mode === "listening") return;

    setErr("");
    setPartial("");
    setFinalText("");
    setMode("listening");

    const rec = buildRecognition();
    if (!rec) {
      setErr("SpeechRecognition unavailable.");
      setMode("error");
      return;
    }
    recRef.current = rec;

    rec.onresult = (ev) => {
      let interim = "";
      let final = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const chunk = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) final += chunk;
        else interim += chunk;
      }
      if (interim) setPartial(interim);
      if (final) setFinalText((prev) => (prev ? prev + " " : "") + final);
    };

    rec.onerror = (e) => {
      setErr(`STT error: ${e.error || "unknown"}`);
      setMode("error");
    };

    rec.onend = () => {
      // end of user's turn (silence/pause)
      if (mode === "listening") {
        const text = (finalText || partial || "").trim();
        if (text) {
          setPartial("");
          setMode("thinking");
          handleUserUtterance(text);
        } else {
          // no speech — if auto-turns, go back to idle and wait for a click again or restart
          setMode("idle");
        }
      }
    };

    // expose a stop function
    stopRecRef.current = () => {
      try {
        rec.stop();
      } catch {}
    };

    try {
      rec.start();
    } catch (e) {
      setErr("Failed to start microphone (permissions?).");
      setMode("error");
    }
  }

  function stopListening() {
    try {
      stopRecRef.current();
    } catch {}
  }

  // ======= flow: user text -> assistant -> TTS -> play -> (auto listen) =======
  async function handleUserUtterance(text) {
    // append user message to history
    setHistory((h) => [...h, { role: "user", text }]);

    try {
      // call your assistant/chat endpoint
      const resp = await fetch(ASSIST_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: USER_ID,
          message: text,
          // optionally pass history/context if your backend uses it
          history: history.slice(-6), // last few turns
        }),
      });

      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`Assistant error: ${resp.status} ${t}`);
      }
      const data = await resp.json();
      const reply = data.reply || "Okay. I noted that.";

      // update assistant history text
      setHistory((h) => [...h, { role: "assistant", text: reply }]);

      // TTS
      setMode("speaking");
      await speak(reply);
    } catch (e) {
      setErr(e.message || "Assistant failed");
      setMode("error");
    }
  }

  async function speak(text) {
    try {
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: VOICE,
          model_id: MODEL_ID,
          optimize_streaming_latency: 2,
        }),
      });
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`TTS error: ${resp.status} ${t}`);
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        // stop any current playback
        try { audioRef.current.pause(); } catch {}
        audioRef.current.src = url;
        const p = audioRef.current.play();
        if (p && p.then) await p;
      }
    } catch (e) {
      setErr(e.message || "TTS failed");
      setMode("error");
    }
  }

  // after TTS playback ends, auto-listen again if enabled
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => {
      setMode("idle");
      if (autoTurns) {
        // small pause to avoid immediate mic open while user is reacting
        setTimeout(() => {
          if (mountedRef.current) startListening();
        }, 300);
      }
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTurns, token]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopListening();
    };
  }, []);

  // ======= manual controls =======
  const canStart = useMemo(() => !!token && sttSupported && mode !== "listening" && mode !== "speaking" && mode !== "thinking", [token, sttSupported, mode]);
  const canStop = useMemo(() => mode === "listening", [mode]);

  return (
    <div style={outer}>
      <div style={card}>
        <h2 style={h2}>Voice Chat (turn‑taking)</h2>
        <p style={sub}>
          Speak, wait, hear reply — then it auto‑listens again. Toggle auto‑turns if you want manual push‑to‑talk.
        </p>

        <div style={row}>
          <button
            onClick={startListening}
            disabled={!canStart}
            style={{ ...btn, opacity: canStart ? 1 : 0.5 }}
          >
            {mode === "listening" ? "Listening…" : "Start Talking"}
          </button>
          <button
            onClick={stopListening}
            disabled={!canStop}
            style={{ ...btn, background: "#2D364A", opacity: canStop ? 1 : 0.5 }}
          >
            Stop
          </button>

          <label style={toggle}>
            <input
              type="checkbox"
              checked={autoTurns}
              onChange={(e) => setAutoTurns(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Auto turn-taking
          </label>
        </div>

        {mode === "listening" && (
          <div style={listenBox}>
            <div style={{ fontSize: 12, color: "#AAB7D4", marginBottom: 6 }}>Listening… (pause to finish)</div>
            <div style={bubbleYou}>
              {(finalText || partial || "").trim() || "…"}
            </div>
          </div>
        )}

        {mode === "thinking" && <div style={thinking}>Thinking…</div>}
        {mode === "speaking" && <div style={speaking}>Speaking…</div>}
        {!!err && <div style={errBox}>{err}</div>}

        <audio ref={audioRef} controls style={audio} />

        <div style={histWrap}>
          <h3 style={h3}>Conversation</h3>
          <div>
            {history.map((m, i) => (
              <div key={i} style={m.role === "user" ? bubbleYou : bubbleBot}>
                <div style={tag}>{m.role}</div>
                <div>{m.text}</div>
              </div>
            ))}
          </div>
        </div>

        {!sttSupported && (
          <div style={warn}>
            Your browser doesn’t support SpeechRecognition. Use Chrome/Edge or fall back to text chat.
          </div>
        )}
      </div>
    </div>
  );
}

/* inline styles */
const outer = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #0b1220 0%, #0a0f1a 100%)",
  padding: "40px 16px",
  boxSizing: "border-box",
  color: "#E9ECF8",
};
const card = {
  maxWidth: 960,
  margin: "0 auto",
  background: "rgba(29,36,57,0.9)",
  border: "1px solid rgba(99,123,255,0.25)",
  borderRadius: 16,
  boxShadow: "0 16px 50px rgba(0,0,0,0.35)",
  padding: 20,
};
const h2 = { margin: "4px 0 0", fontSize: 22 };
const sub = { margin: "6px 0 16px", color: "#A9B4D0", fontSize: 13 };
const row = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 };
const btn = {
  background: "linear-gradient(90deg, #6C5CE7 0%, #8E79FF 100%)",
  border: 0,
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer",
};
const toggle = { display: "inline-flex", alignItems: "center", marginLeft: "auto", fontSize: 13, color: "#C9D3EC" };
const listenBox = {
  background: "#11192b",
  border: "1px solid #233054",
  borderRadius: 12,
  padding: 12,
  marginTop: 8,
};
const thinking = { marginTop: 8, color: "#C6D0F6", fontStyle: "italic" };
const speaking = { marginTop: 8, color: "#C6F6D0", fontStyle: "italic" };
const errBox = {
  marginTop: 10,
  background: "#3a2234",
  color: "#ffc8e3",
  border: "1px solid #7a2d4e",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
};
const audio = {
  width: "100%",
  marginTop: 10,
  background: "#0f1424",
  borderRadius: 10,
  border: "1px solid #2C3654",
  padding: 8,
};
const histWrap = { marginTop: 16 };
const h3 = { margin: "0 0 8px 0", fontSize: 16 };
const tag = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  color: "#9fb4ff",
  marginBottom: 4,
};
const bubbleYou = {
  background: "#1a2441",
  border: "1px solid #2d3b65",
  padding: 10,
  borderRadius: 12,
  marginBottom: 8,
};
const bubbleBot = {
  background: "#202b4a",
  border: "1px solid #32406e",
  padding: 10,
  borderRadius: 12,
  marginBottom: 8,
};
const warn = {
  marginTop: 12,
  background: "#3a2e22",
  color: "#ffe0b3",
  border: "1px solid #6e5732",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
};
