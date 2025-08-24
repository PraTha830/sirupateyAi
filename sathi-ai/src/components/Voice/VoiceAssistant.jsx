import React, { useEffect, useRef, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";
const USER_ID = "user_123";

async function getToken() {
  let tok = localStorage.getItem("token");
  if (tok) return tok;
  const r = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: USER_ID }),
  });
  const data = await r.json();
  tok = data?.access_token;
  if (tok) localStorage.setItem("token", tok);
  return tok;
}

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [persona, setPersona] = useState("friend"); // krishna|father|mother|friend
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const autoTurnRef = useRef(true); // auto re-listen after reply

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setConversation((c) => [...c, { role: "user", text }]);
      await handleAsk(text);
    };

    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  async function callWithAuth(url, options) {
    let token = await getToken();
    const doFetch = () =>
      fetch(url, {
        ...(options || {}),
        headers: {
          ...(options?.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });

    let res = await doFetch();
    if (res.status === 401) {
      // refresh token and retry once
      localStorage.removeItem("token");
      token = await getToken();
      res = await fetch(url, {
        ...(options || {}),
        headers: { ...(options?.headers || {}), Authorization: `Bearer ${token}` },
      });
    }
    return res;
  }

  const speak = async (text, voice = "Rachel", model_id = "eleven_turbo_v2") => {
    const res = await callWithAuth(`${API_BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice, model_id }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = audioRef.current;
    audio.src = url;
    await audio.play();
    audio.onended = () => {
      if (autoTurnRef.current) startListening();
    };
  };

  const handleAsk = async (text) => {
    try {
      const res = await callWithAuth(`${API_BASE}/assistant/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: USER_ID,
          text,
          want_tts: true,
          voice: "Rachel",
          persona,
          timezone_offset_minutes: -new Date().getTimezoneOffset(),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setConversation((c) => [...c, { role: "assistant", text: "Sorry—server error." }]);
        console.error("ask error:", res.status, errText);
        if (autoTurnRef.current) startListening();
        return;
      }

      const data = await res.json();
      const reply = data.reply_text || "Okay.";
      setConversation((c) => [...c, { role: "assistant", text: reply }]);

      // play voice
      if (data.speak?.text) {
        await speak(data.speak.text, data.speak.voice, data.speak.model_id);
      } else if (autoTurnRef.current) {
        startListening();
      }
    } catch (e) {
      console.error(e);
      setConversation((c) => [...c, { role: "assistant", text: "Network error." }]);
      if (autoTurnRef.current) startListening();
    }
  };

  const container = {
    maxWidth: 720, margin: "24px auto", color: "#e5e7eb",
    padding: 24, background: "#0b1220", borderRadius: 16, border: "1px solid #1f2a44"
  };

  return (
    <div style={container}>
      <h2 style={{ marginTop: 0 }}>Voice Chat (turn‑taking)</h2>
      <p>Speak, wait, hear reply — it will auto‑listen again like ChatGPT voice mode.</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <button onClick={listening ? stopListening : startListening}
                style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #334155", background: listening ? "#ef4444" : "#10b981", color: "white" }}>
          {listening ? "Stop" : "Start"} Listening
        </button>

        <label style={{ marginLeft: 8 }}>
          Persona:&nbsp;
          <select value={persona} onChange={(e) => setPersona(e.target.value)}
                  style={{ background: "#0b1220", color: "#e5e7eb", border: "1px solid #334155", borderRadius: 8, padding: "6px 8px" }}>
            <option value="friend">Friend</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="krishna">Krishna</option>
          </select>
        </label>

        <label style={{ marginLeft: 8 }}>
          <input
            type="checkbox"
            defaultChecked
            onChange={(e) => (autoTurnRef.current = e.target.checked)}
          />{" "}
          Auto turn‑taking
        </label>
      </div>

      <div style={{ padding: 12, background: "#0f172a", borderRadius: 10, border: "1px solid #1f2a44", marginBottom: 16 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
          {listening ? "Listening… (pause to finish)" : "Not listening"}
        </div>
        <input
          readOnly
          value={transcript}
          placeholder="Say something…"
          style={{
            width: "100%", padding: "10px 12px", background: "#111827", color: "#e5e7eb",
            border: "1px solid #334155", borderRadius: 10
          }}
        />
      </div>

      <audio ref={audioRef} controls style={{ width: "100%", marginBottom: 16 }} />

      <h3 style={{ marginTop: 16 }}>Conversation</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {conversation.map((m, i) => (
          <div key={i}
               style={{
                 padding: "10px 12px",
                 borderRadius: 10,
                 border: "1px solid #1f2a44",
                 background: m.role === "user" ? "#0f172a" : "#0b1220"
               }}>
            <strong style={{ color: m.role === "user" ? "#34d399" : "#60a5fa" }}>
              {m.role}
            </strong>
            <div style={{ marginTop: 4 }}>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
