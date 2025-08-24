import React, { useEffect, useMemo, useRef, useState } from "react";

export default function VoiceAssistant() {
  const [text, setText] = useState(
    `hey jarvis — i hear you. here's the pragmatic next step: focus on a small, testable action you can complete today.`
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const audioRef = useRef(null);

  // try to hydrate a bearer token; fallback to fetch one from /auth/token
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || "");

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      (async () => {
        try {
          const resp = await fetch("http://127.0.0.1:8000/auth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: "user_123" }),
          });
          if (!resp.ok) throw new Error("token fetch failed");
          const data = await resp.json();
          if (!cancelled) {
            localStorage.setItem("access_token", data.access_token);
            setToken(data.access_token);
          }
        } catch (e) {
          if (!cancelled) setErr("Could not get auth token");
        }
      })();
    }
    return () => { cancelled = true; };
  }, [token]);

  const canSpeak = useMemo(() => Boolean(text.trim()) && Boolean(token) && !loading, [text, token, loading]);

  async function speak() {
    setErr("");
    if (!token) {
      setErr("Missing token");
      return;
    }
    if (!text.trim()) return;

    try {
      setLoading(true);

      // POST to your FastAPI /tts endpoint – returns audio/mpeg as a stream
      const resp = await fetch("http://127.0.0.1:8000/tts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice: "Rachel",
          model_id: "eleven_turbo_v2",
          optimize_streaming_latency: 2
        }),
      });

      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(`TTS error: ${resp.status} ${msg}`);
      }

      // create an object URL so we can play without downloading a file
      const audioBlob = await resp.blob();
      const objectUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        // Stop any current playback
        try { audioRef.current.pause(); } catch {}
        audioRef.current.src = objectUrl;
        const playPromise = audioRef.current.play();
        if (playPromise && typeof playPromise.then === "function") {
          await playPromise;
        }
      }
    } catch (e) {
      setErr(e.message || "Unknown TTS error");
    } finally {
      setLoading(false);
    }
  }

  // simple UI
  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Voice Assistant</h1>
        <p style={subtitleStyle}>Type, press Speak, it will auto‑play the new audio.</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Say something…"
          style={textareaStyle}
        />

        <div style={rowStyle}>
          <button
            onClick={speak}
            disabled={!canSpeak}
            style={{ ...btnStyle, opacity: canSpeak ? 1 : 0.6, cursor: canSpeak ? "pointer" : "not-allowed" }}
          >
            {loading ? "Speaking…" : "Speak"}
          </button>

          <button
            onClick={() => {
              const sample = `hey jarvis — can you remind me to apply for OPT on friday at 4pm and also create a note titled "OPT checklist"?`;
              setText(sample);
              // optional: auto-speak right after setting sample
              setTimeout(() => {
                if (!loading) speak();
              }, 50);
            }}
            style={{ ...btnStyle, background: "#2f3947" }}
          >
            Insert Example
          </button>
        </div>

        {!!err && <div style={errorStyle}>{err}</div>}

        <audio ref={audioRef} controls style={audioStyle} />
      </div>
    </div>
  );
}

/* inline styles */
const outerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #0b1220 0%, #0a0f1a 100%)",
  padding: "40px 16px",
  boxSizing: "border-box",
};

const cardStyle = {
  maxWidth: 900,
  margin: "0 auto",
  background: "rgba(29, 36, 57, 0.85)",
  border: "1px solid rgba(99, 123, 255, 0.25)",
  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
  borderRadius: 16,
  padding: 20,
  color: "#E9ECF8",
};

const titleStyle = { margin: "6px 0 0 0", fontSize: 24, fontWeight: 700, letterSpacing: 0.2 };
const subtitleStyle = { margin: "8px 0 16px", color: "#A9B4D0", fontSize: 14 };

const textareaStyle = {
  width: "100%",
  background: "#121829",
  color: "#E9ECF8",
  border: "1px solid #2C3654",
  borderRadius: 10,
  padding: 12,
  lineHeight: 1.5,
  outline: "none",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  marginBottom: 12,
};

const rowStyle = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };

const btnStyle = {
  background: "linear-gradient(90deg, #6C5CE7 0%, #8E79FF 100%)",
  border: 0,
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  fontWeight: 600,
};

const errorStyle = {
  marginTop: 12,
  background: "#3a2234",
  color: "#ffc8e3",
  border: "1px solid #7a2d4e",
  padding: 10,
  borderRadius: 8,
  fontSize: 13,
};

const audioStyle = {
  width: "100%",
  marginTop: 12,
  background: "#0f1424",
  borderRadius: 10,
  border: "1px solid #2C3654",
  padding: 8,
};
