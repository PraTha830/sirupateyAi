import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Voice assistant with real turn-taking:
 * 1) User clicks Start (user gesture unlocks audio autoplay)
 * 2) Listen -> on pause -> send to /assistant/chat -> /tts -> play
 * 3) After audio ends -> auto listen again (toggleable)
 *
 * Requires Chrome/Edge (Web Speech API). Safari mobile STT not supported.
 */
export default function VoiceAssistant() {
  // ======= config =======
  const API_BASE = "http://127.0.0.1:8000";
  const AUTH_URL = `${API_BASE}/auth/token`;
  const CHAT_URL = `${API_BASE}/assistant/chat`;
  const TTS_URL = `${API_BASE}/tts`;

  const USER_ID = "user_123";
  const DEFAULT_VOICE = "Rachel";          // Any ElevenLabs voice your backend accepts
  const DEFAULT_MODEL = "eleven_turbo_v2"; // ElevenLabs model id

  // Personas -> (optional) suggested voices (you can keep one voice if you want)
  const PERSONAS = [
    { key: "krishna", label: "Krishna", voice: "Rachel" },
    { key: "father",  label: "Father",  voice: "George" },
    { key: "mother",  label: "Mother",  voice: "Sarah" },
    { key: "friend",  label: "Friend",  voice: "Charlie" },
  ];

  // ======= state =======
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || "");
  const [persona, setPersona] = useState(PERSONAS[0].key);
  const [voice, setVoice] = useState(PERSONAS[0].voice || DEFAULT_VOICE);
  const [autoTurns, setAutoTurns] = useState(true);

  const [mode, setMode] = useState("idle"); // idle | listening | thinking | speaking | error
  const [err, setErr] = useState("");

  const [partial, setPartial] = useState("");
  const [history, setHistory] = useState([]); // [{role:'user'|'assistant', text}]

  const audioRef = useRef(null);
  const recRef = useRef(null);
  const mountedRef = useRef(false);
  const stoppingMicRef = useRef(false); // guard to avoid duplicate onend flows

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
        if (!r.ok) throw new Error(`Token fetch failed: ${r.status}`);
        const j = await r.json();
        if (!cancelled) {
          localStorage.setItem("access_token", j.access_token);
          setToken(j.access_token);
          console.log("[voice] token acquired");
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setErr("Could not get auth token");
          setMode("error");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // ======= browser STT availability =======
  const sttSupported = useMemo(
    () => typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window),
    []
  );

  function buildRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous = false;       // stop on pause (good for turn-taking)
    rec.interimResults = true;    // we show partial
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

    // stop any playback before opening mic (prevents echo feedback)
    try { audioRef.current?.pause(); } catch {}
    stoppingMicRef.current = false;

    setErr("");
    setPartial("");
    setMode("listening");

    const rec = buildRecognition();
    if (!rec) {
      setErr("SpeechRecognition unavailable.");
      setMode("error");
      return;
    }
    recRef.current = rec;

    // local holders (avoid stale React state)
    let finalCollected = "";

    rec.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const chunk = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalCollected += chunk;
        else interim += chunk;
      }
      if (interim) setPartial(interim);
      if (finalCollected) setPartial(finalCollected); // show last “final” too
    };

    rec.onerror = (e) => {
      console.error("[voice] STT error", e);
      setErr(`STT error: ${e.error || "unknown"}`);
      setMode("error");
    };

    rec.onend = async () => {
      if (stoppingMicRef.current) return; // we intentionally stopped
      // end of user's turn (pause)
      const text = (finalCollected || partial || "").trim();
      setPartial("");
      if (!text) {
        setMode("idle");
        if (autoTurns) {
          // reopen mic after a short pause
          setTimeout(() => mountedRef.current && startListening(), 350);
        }
        return;
      }
      setMode("thinking");
      await handleUserUtterance(text);
    };

    try {
      rec.start();
      console.log("[voice] listening…");
    } catch (e) {
      console.error(e);
      setErr("Failed to start microphone (permissions?).");
      setMode("error");
    }
  }

  function stopListening() {
    const rec = recRef.current;
    if (!rec) return;
    stoppingMicRef.current = true;
    try { rec.stop(); } catch {}
    recRef.current = null;
    console.log("[voice] mic stopped");
  }

  // ======= core flow =======
  async function handleUserUtterance(text) {
    // add to history
    setHistory((h) => [...h, { role: "user", text }]);
    // ensure mic is off while thinking
    stopListening();

    // derive voice if persona maps to one
    const personaConf = PERSONAS.find((p) => p.key === persona);
    const selectedVoice = personaConf?.voice || voice || DEFAULT_VOICE;

    try {
      // 1) ask assistant
      console.log("[voice] chatting =>", text, "(persona:", persona, ")");
      const chat = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: USER_ID,
          message: text,
          persona,
          // you can pass short history to improve responses
          history: history.slice(-6),
        }),
      });

      if (!chat.ok) {
        const t = await chat.text();
        throw new Error(`Assistant error ${chat.status}: ${t}`);
      }
      const { reply = "Okay." } = await chat.json();
      setHistory((h) => [...h, { role: "assistant", text: reply }]);

      // 2) synthesize voice
      setMode("speaking");
      console.log("[voice] TTS with voice:", selectedVoice);
      await speak(reply, selectedVoice);

      // after playback, auto listen again
    } catch (e) {
      console.error(e);
      setErr(e.message || "Assistant failed");
      setMode("error");
    }
  }

  async function speak(text, selectedVoice) {
    try {
      const r = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          voice: selectedVoice || DEFAULT_VOICE,
          model_id: DEFAULT_MODEL,
          optimize_streaming_latency: 2,
        }),
      });

      const ctype = r.headers.get("Content-Type") || "";
      if (!r.ok) {
        const t = await r.text(); // most likely JSON error
        throw new Error(`TTS ${r.status}: ${t}`);
      }
      if (!ctype.includes("audio/mpeg")) {
        const t = await r.text();
        throw new Error(`Unexpected TTS content-type: ${ctype}\n${t}`);
      }

      // Play
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const audio = audioRef.current;
      if (!audio) return;

      try { audio.pause(); } catch {}
      audio.src = url;
      // These attributes help autoplay in some browsers (gesture already occurred)
      audio.autoplay = true;
      audio.playsInline = true;

      const p = audio.play();
      if (p && p.catch) {
        p.catch((e) => {
          // Autoplay may still be blocked if Start wasn’t clicked — show prompt
          console.warn("Audio play blocked, waiting for user gesture", e);
        });
      }
    } catch (e) {
      console.error(e);
      setErr(e.message || "TTS failed");
      setMode("error");
    }
  }

  // after TTS playback ends, go back to listening if auto
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => {
      setMode("idle");
      if (autoTurns && mountedRef.current) {
        setTimeout(() => startListening(), 350);
      }
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTurns, token, persona, voice]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopListening();
      try { audioRef.current?.pause(); } catch {}
    };
  }, []);

  const canStart = useMemo(
    () => !!token && sttSupported && !["listening", "thinking", "speaking"].includes(mode),
    [token, sttSupported, mode]
  );
  const canStop = mode === "listening";

  return (
    <div style={outer}>
      <div style={card}>
        <h2 style={h2}>Voice Chat (turn‑taking)</h2>
        <p style={sub}>
          Speak, pause, hear reply — then it auto‑listens again. Choose a persona and toggle auto‑turns.
        </p>

        <div style={row}>
          <button onClick={startListening} disabled={!canStart} style={{ ...btn, opacity: canStart ? 1 : 0.6 }}>
            {mode === "listening" ? "Listening…" : "Start"}
          </button>
          <button onClick={stopListening} disabled={!canStop} style={{ ...btn, background: "#2D364A", opacity: canStop ? 1 : 0.6 }}>
            Stop
          </button>

          <label style={field}>
            Persona:&nbsp;
            <select
              value={persona}
              onChange={(e) => {
                const p = e.target.value;
                setPersona(p);
                const found = PERSONAS.find((x) => x.key === p);
                if (found?.voice) setVoice(found.voice);
              }}
              style={select}
            >
              {PERSONAS.map((p) => (
                <option value={p.key} key={p.key}>{p.label}</option>
              ))}
            </select>
          </label>

          <label style={field}>
            Voice:&nbsp;
            <input value={voice} onChange={(e) => setVoice(e.target.value)} style={input} />
          </label>

          <label style={{ ...field, marginLeft: "auto" }}>
            <input type="checkbox" checked={autoTurns} onChange={(e) => setAutoTurns(e.target.checked)} />
            &nbsp;Auto turn‑taking
          </label>
        </div>

        {mode === "listening" && (
          <div style={listenBox}>
            <div style={{ fontSize: 12, color: "#AAB7D4", marginBottom: 6 }}>Listening… (pause to finish)</div>
            <div style={bubbleYou}>{(partial || "…").trim()}</div>
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
const field = { display: "inline-flex", alignItems: "center", fontSize: 13, color: "#C9D3EC" };
const select = {
  background: "#11192b",
  border: "1px solid #233054",
  color: "#E9ECF8",
  padding: "6px 8px",
  borderRadius: 8,
};
const input = {
  background: "#11192b",
  border: "1px solid #233054",
  color: "#E9ECF8",
  padding: "6px 8px",
  borderRadius: 8,
  width: 140,
};
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
  whiteSpace: "pre-wrap",
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
