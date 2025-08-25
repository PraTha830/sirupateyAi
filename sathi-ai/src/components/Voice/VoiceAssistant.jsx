import React, { useEffect, useRef, useState } from "react";

/** ---- Config ---- */
const API_BASE = "http://127.0.0.1:8000";
const USER_ID = "user_123";

/** ---- Auth helper ---- */
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

/** ---- Inline Voice Cloner subcomponent ---- */
function VoiceCloner({ onCloned }) {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);

  const box = {
    padding: 16, border: "1px solid #334155", borderRadius: 12, marginTop: 16,
    background: "#0f172a"
  };

  const input = {
    padding: "8px 10px",
    background: "#0b1220",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 8,
  };

  const btn = (disabled) => ({
    padding: "10px 14px",
    background: disabled ? "#64748b" : "#10b981",
    color: "white",
    border: "1px solid #334155",
    borderRadius: 8,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const handleClone = async (e) => {
    e.preventDefault();
    if (!name || files.length === 0) {
      alert("Provide a voice name and at least one audio file.");
      return;
    }
    setBusy(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append("name", name);
      // Optional extras:
      // fd.append("description", "Cloned via UI");
      // fd.append("labels_json", JSON.stringify({ persona: "friend" }));
      for (const f of files) fd.append("files", f);

      const res = await fetch(`${API_BASE}/tts/clone`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }
      const v = await res.json(); // {voice_id, name,...}
      onCloned?.(v);
      setName("");
      setFiles([]);
      alert(`Cloned! ${v.name} (${v.voice_id})`);
    } catch (err) {
      console.error(err);
      alert("Clone failed. See console for details.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={box}>
      <h3 style={{ marginTop: 0 }}>Clone a Voice</h3>
      <form onSubmit={handleClone} style={{ display: "grid", gap: 10 }}>
        <input
          type="text"
          placeholder="New voice name (e.g., MyVoice)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
        />
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          style={{ color: "#e5e7eb" }}
        />
        <button type="submit" disabled={busy} style={btn(busy)}>
          {busy ? "Cloning..." : "Clone Voice"}
        </button>
      </form>
    </div>
  );
}

/** ---- Main component ---- */
export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const [persona, setPersona] = useState("friend"); // krishna|father|mother|friend
  const [voices, setVoices] = useState([]);         // [{voice_id, name, category}]
  const [voiceIdOrName, setVoiceIdOrName] = useState("Rachel"); // default
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const autoTurnRef = useRef(true); // auto re-listen after reply

  useEffect(() => {
    audioRef.current = new Audio();
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/tts/voices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setVoices(data.voices || []);
          // If Rachel exists, default to it; else first voice available.
          const rachel = (data.voices || []).find(v => v.name === "Rachel");
          setVoiceIdOrName(rachel ? rachel.voice_id : (data.voices?.[0]?.voice_id || "Rachel"));
        }
      } catch (e) {
        console.error("Failed to load voices", e);
      }
    })();
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
      localStorage.removeItem("token");
      token = await getToken();
      res = await fetch(url, {
        ...(options || {}),
        headers: { ...(options?.headers || {}), Authorization: `Bearer ${token}` },
      });
    }
    return res;
  }

  const speak = async (text, v = voiceIdOrName, model_id = "eleven_turbo_v2") => {
    const res = await callWithAuth(`${API_BASE}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice: v, model_id }),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("TTS error:", res.status, t);
      if (autoTurnRef.current) startListening();
      return;
    }
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
          voice: voiceIdOrName, // can be name or voice_id
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

      // speak reply
      if (data.speak?.text) {
        await speak(data.speak.text, voiceIdOrName, data.speak.model_id || "eleven_turbo_v2");
      } else if (autoTurnRef.current) {
        startListening();
      }
    } catch (e) {
      console.error(e);
      setConversation((c) => [...c, { role: "assistant", text: "Network error." }]);
      if (autoTurnRef.current) startListening();
    }
  };

  /** ---- Styles ---- */
  const container = {
    maxWidth: 760, margin: "24px auto", color: "#e5e7eb",
    padding: 24, background: "#0b1220", borderRadius: 16, border: "1px solid #1f2a44"
  };
  const selectStyle = {
    background: "#0b1220", color: "#e5e7eb",
    border: "1px solid #334155", borderRadius: 8, padding: "6px 8px"
  };

  /** ---- UI ---- */
  return (
    <div style={container}>
      <h2 style={{ marginTop: 0 }}>Voice Chat (turn‑taking)</h2>
      <p>Speak → wait → hear reply. It auto‑listens again (ChatGPT‑style voice mode).</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            padding: "10px 16px", borderRadius: 10,
            border: "1px solid #334155",
            background: listening ? "#ef4444" : "#10b981",
            color: "white"
          }}
        >
          {listening ? "Stop" : "Start"} Listening
        </button>

        <label style={{ marginLeft: 8 }}>
          Persona:&nbsp;
          <select value={persona} onChange={(e) => setPersona(e.target.value)} style={selectStyle}>
            <option value="friend">Friend</option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="krishna">Krishna</option>
          </select>
        </label>

        <label style={{ marginLeft: 8 }}>
          Voice:&nbsp;
          <select
            value={voiceIdOrName}
            onChange={(e) => setVoiceIdOrName(e.target.value)}
            style={selectStyle}
            title="Choose a premade/cloned voice"
          >
            {/* Allow typing 'Rachel' fallback if list is empty */}
            {voices.length === 0 && <option value="Rachel">Rachel (default)</option>}
            {voices.map(v => (
              <option key={v.voice_id} value={v.voice_id}>
                {v.name} {v.category ? `(${v.category})` : ""}
              </option>
            ))}
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

      <div style={{
        padding: 12, background: "#0f172a", borderRadius: 10,
        border: "1px solid #1f2a44", marginBottom: 16
      }}>
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
                 padding: "10px 12px", borderRadius: 10, border: "1px solid #1f2a44",
                 background: m.role === "user" ? "#0f172a" : "#0b1220"
               }}>
            <strong style={{ color: m.role === "user" ? "#34d399" : "#60a5fa" }}>
              {m.role}
            </strong>
            <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Inline cloner */}
      <VoiceCloner
        onCloned={async () => {
          try {
            const token = await getToken();
            const res = await fetch(`${API_BASE}/tts/voices`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const data = await res.json();
              setVoices(data.voices || []);
            }
          } catch (e) {
            console.error("refresh voices failed", e);
          }
        }}
      />
    </div>
  );
}
