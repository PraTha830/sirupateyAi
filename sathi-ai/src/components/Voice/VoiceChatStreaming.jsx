import React, { useEffect, useMemo, useRef, useState } from "react";

/** ====== Minimal Config ====== */
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";
/** Optional: if you have a chat endpoint that returns { reply: string } */
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT ?? ""; // e.g. `${API_BASE}/chat`
const DEFAULT_USER = "user_123";
const DEFAULT_VOICE = "Rachel";
const DEFAULT_MODEL = "eleven_turbo_v2";

/** ====== Inline Styles ====== */
const styles = {
  container: {
    maxWidth: 820,
    margin: "24px auto",
    padding: 20,
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#111827",
  },
  h1: { fontSize: 22, fontWeight: 700, margin: "0 0 10px" },
  row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  col: { flex: 1, minWidth: 220 },
  label: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    outline: "none",
    background: "#fff",
  },
  chatBox: {
    marginTop: 14,
    padding: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    background: "#fafafa",
    maxHeight: 320,
    overflowY: "auto",
  },
  bubbleUser: {
    background: "#111827",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 12,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  bubbleBot: {
    background: "#e5e7eb",
    color: "#111827",
    padding: "8px 10px",
    borderRadius: 12,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  bubbleWrap: { display: "flex", marginBottom: 8 },
  bubbleWrapEnd: { display: "flex", justifyContent: "flex-end", marginBottom: 8 },
  controls: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 12,
    flexWrap: "wrap",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 600,
  },
  micBtn: (active) => ({
    padding: "10px 14px",
    borderRadius: 999,
    border: active ? "2px solid #ef4444" : "1px solid #111827",
    background: active ? "#fee2e2" : "#111827",
    color: active ? "#ef4444" : "#fff",
    cursor: "pointer",
    fontWeight: 700,
  }),
  hint: { fontSize: 12, color: "#6b7280", marginTop: 6 },
  error: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#fef2f2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },
  audio: { width: "100%", marginTop: 8 },
};

/** ====== Token helpers ====== */
const TOKEN_KEY = "jwt_token";
const USER_KEY = "jwt_user";

async function fetchNewToken(userId) {
  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(USER_KEY, userId);
  return data.access_token;
}
async function getTokenEnsured(userId) {
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) token = await fetchNewToken(userId);
  return token;
}

/** ====== STT (Web Speech API) ====== */
function useSpeechRecognition({ onResult, onEnd }) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const supported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  useEffect(() => {
    if (!supported) return;
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {}
    };
  }, [supported]);

  const start = () => {
    if (!recRef.current) return;
    let finalText = "";
    setListening(true);
    recRef.current.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
      }
      onResult?.(transcript, false);
    };
    recRef.current.onend = () => {
      setListening(false);
      onEnd?.();
      onResult?.("", true);
    };
    recRef.current.onerror = () => {
      setListening(false);
      onEnd?.();
    };
    recRef.current.start();
  };

  const stop = () => {
    try {
      recRef.current?.stop();
    } catch {}
  };

  return { supported, listening, start, stop };
}

/** ====== TTS Streaming to <audio> via MediaSource ====== */
async function streamTTSToAudio({
  apiBase,
  token,
  text,
  voice,
  modelId,
  audioEl,
  onError,
}) {
  // Try MediaSource streaming first (best UX)
  const useMSE =
    "MediaSource" in window &&
    MediaSource.isTypeSupported("audio/mpeg"); // mp3 chunks

  if (!useMSE) {
    // Fallback: fetch whole blob and play
    const res = await fetch(`${apiBase}/tts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voice, model_id: modelId }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioEl.src = url;
    await audioEl.play().catch(() => {});
    return;
  }

  const mediaSource = new MediaSource();
  const objectUrl = URL.createObjectURL(mediaSource);
  audioEl.src = objectUrl;

  let sourceBuffer;
  let queue = [];
  let updating = false;
  let done = false;

  function appendNext() {
    if (!sourceBuffer || updating) return;
    if (!queue.length) {
      if (done) {
        try {
          mediaSource.endOfStream();
        } catch {}
      }
      return;
    }
    updating = true;
    const chunk = queue.shift();
    try {
      sourceBuffer.appendBuffer(chunk);
    } catch (e) {
      onError?.(e);
      try {
        mediaSource.endOfStream();
      } catch {}
    }
  }

  mediaSource.addEventListener("sourceopen", async () => {
    try {
      sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
      sourceBuffer.mode = "sequence";
      sourceBuffer.addEventListener("updateend", () => {
        updating = false;
        appendNext();
      });

      // Start the stream fetch
      let res = await fetch(`${apiBase}/tts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice, model_id: modelId }),
      });
      if (!res.ok) throw new Error(`TTS ${res.status}`);

      const reader = res.body.getReader();
      // Kick off playback as soon as metadata is set
      audioEl.play().catch(() => {});

      while (true) {
        const { value, done: rdDone } = await reader.read();
        if (rdDone) break;
        if (value && value.byteLength) {
          // Ensure we enqueue a copy (ArrayBuffer)
          const buf = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
          queue.push(new Uint8Array(buf));
          appendNext();
        }
      }
    } catch (e) {
      onError?.(e);
      try {
        mediaSource.endOfStream();
      } catch {}
    } finally {
      done = true;
      appendNext();
    }
  });

  // Make sure audio starts when enough data is buffered
  audioEl.oncanplay = () => {
    audioEl.play().catch(() => {});
  };
}

/** ====== Optional Chat turn (replace with your own) ====== */
async function getAssistantReply(userText, token) {
  if (CHAT_ENDPOINT) {
    const res = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply || userText;
    }
  }
  // Fallback: lightly “coachify” the echo
  return (
    "I hear you. " +
    userText +
    " — here’s the pragmatic next step: focus on a small, testable action you can complete today."
  );
}

/** ====== Component ====== */
export default function VoiceChatStreaming() {
  const [userId, setUserId] = useState(localStorage.getItem(USER_KEY) || DEFAULT_USER);
  const [voice, setVoice] = useState(DEFAULT_VOICE);
  const [modelId, setModelId] = useState(DEFAULT_MODEL);
  const [voices, setVoices] = useState([]);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const audioRef = useRef(null);
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! Hold the mic to speak. I’ll answer in real‑time." },
  ]);

  const { supported: sttSupported, listening, start, stop } = useSpeechRecognition({
    onResult: (txt, final) => {
      // update live transcript in the UI
      setMessages((m) => {
        const last = m[m.length - 1];
        if (last && last.role === "user" && last.live) {
          const nm = [...m];
          nm[nm.length - 1] = { ...last, text: txt, live: !final };
          return nm;
        } else {
          return [...m, { role: "user", text: txt, live: !final }];
        }
      });
    },
    onEnd: () => {},
  });

  // auto-scroll chat
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // cold‑start token & voices (best-effort)
  useEffect(() => {
    fetchNewToken(userId).catch(() => {});
  }, []); // eslint-disable-line

  const loadVoices = async () => {
    try {
      const tok = await getTokenEnsured(userId);
      let res = await fetch(`${API_BASE}/tts/voices`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) {
        const nt = await fetchNewToken(userId);
        res = await fetch(`${API_BASE}/tts/voices`, {
          headers: { Authorization: `Bearer ${nt}` },
        });
      }
      if (!res.ok) throw new Error(`voices ${res.status}`);
      const data = await res.json();
      setVoices(data.voices || []);
    } catch (e) {
      setErr(e?.message || "Failed to load voices");
    }
  };

  useEffect(() => {
    loadVoices();
  }, [userId]);

  const voiceOptions = useMemo(() => {
    if (!voices.length) return [{ voice_id: DEFAULT_VOICE, name: DEFAULT_VOICE }];
    const sorted = [...voices].sort((a, b) => a.name.localeCompare(b.name));
    const idx = sorted.findIndex((v) => v.name.toLowerCase() === DEFAULT_VOICE.toLowerCase());
    if (idx > 0) {
      const [fav] = sorted.splice(idx, 1);
      sorted.unshift(fav);
    }
    return sorted;
  }, [voices]);

  const onMicDown = () => {
    if (!sttSupported) {
      setErr("Speech recognition not supported in this browser.");
      return;
    }
    setErr(null);
    // start new live user bubble
    setMessages((m) => [...m, { role: "user", text: "", live: true }]);
    start();
  };

  const onMicUp = async () => {
    if (!listening) return;
    stop();
    // finalize last user bubble (already handled by hook)
    // now produce assistant reply
    setBusy(true);
    try {
      const tok = await getTokenEnsured(userId);
      const lastUser = [...messages].reverse().find((x) => x.role === "user");
      const userText = lastUser?.text?.trim() || "…";
      const replyText = await getAssistantReply(userText, tok);
      setMessages((m) => [...m, { role: "assistant", text: replyText }]);
      // stream TTS
      await streamTTSToAudio({
        apiBase: API_BASE,
        token: tok,
        text: replyText,
        voice,
        modelId,
        audioEl: audioRef.current,
        onError: (e) => setErr(e?.message || "TTS streaming failed"),
      });
    } catch (e) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const speakTyped = async () => {
    const userText = prompt("Type something to say:");
    if (!userText) return;
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setBusy(true);
    try {
      const tok = await getTokenEnsured(userId);
      const replyText = await getAssistantReply(userText, tok);
      setMessages((m) => [...m, { role: "assistant", text: replyText }]);
      await streamTTSToAudio({
        apiBase: API_BASE,
        token: tok,
        text: replyText,
        voice,
        modelId,
        audioEl: audioRef.current,
        onError: (e) => setErr(e?.message || "TTS streaming failed"),
      });
    } catch (e) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Conversational Voice (streaming)</h1>

      <div style={{ ...styles.row, marginBottom: 10 }}>
        <div style={styles.col}>
          <label style={styles.label}>User ID</label>
          <input
            style={styles.input}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="user_123"
          />
        </div>
        <button
          onClick={() => fetchNewToken(userId).then(loadVoices)}
          style={styles.btnGhost}
          title="Fetch token & refresh voices"
        >
          Get Token
        </button>

        <div style={styles.col}>
          <label style={styles.label}>Voice</label>
          <select
            style={styles.select}
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            {voiceOptions.map((v) => (
              <option key={v.voice_id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.col}>
          <label style={styles.label}>Model</label>
          <input
            style={styles.input}
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            placeholder="eleven_turbo_v2"
          />
        </div>
      </div>

      <div ref={chatBoxRef} style={styles.chatBox}>
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} style={isUser ? styles.bubbleWrapEnd : styles.bubbleWrap}>
              <div style={isUser ? styles.bubbleUser : styles.bubbleBot}>
                {m.text || (m.live ? "Listening…" : "")}
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.controls}>
        <button
          onMouseDown={onMicDown}
          onMouseUp={onMicUp}
          onTouchStart={(e) => {
            e.preventDefault();
            onMicDown();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onMicUp();
          }}
          style={styles.micBtn(listening)}
          disabled={busy}
          title="Hold to talk"
        >
          {listening ? "● Recording…" : "🎙️ Hold to talk"}
        </button>

        <button onClick={speakTyped} style={styles.btnGhost} disabled={busy}>
          Type → Voice
        </button>

        <small style={styles.hint}>
          Streaming MP3 via <code>MediaSource</code>. Falls back to non‑streaming blob if needed.
        </small>
      </div>

      {err && <div style={styles.error}>{err}</div>}

      <audio ref={audioRef} controls style={styles.audio} />
    </div>
  );
}
