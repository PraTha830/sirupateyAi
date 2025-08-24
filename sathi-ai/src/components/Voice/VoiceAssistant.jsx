import React, { useState, useRef } from "react";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversation, setConversation] = useState([]);
  const recognitionRef = useRef(null);

  const API_BASE = "http://127.0.0.1:8000";
  const TOKEN = localStorage.getItem("token"); // <-- already generated via /auth/token

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setConversation((c) => [...c, { role: "user", text }]);
      await sendToAssistant(text);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  };

  const sendToAssistant = async (text) => {
    try {
      const res = await fetch(`${API_BASE}/assistant/ask`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: "user_123", text, want_tts: true }),
      });
      const data = await res.json();

      const reply = data.reply_text || "Hmm, I didn’t catch that.";
      setConversation((c) => [...c, { role: "assistant", text: reply }]);

      // 🎤 Play voice response
      if (data.speak && data.speak.text) {
        const ttsRes = await fetch(`${API_BASE}/tts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: data.speak.text,
            voice: data.speak.voice || "Rachel",
            model_id: data.speak.model_id || "eleven_turbo_v2",
          }),
        });
        const blob = await ttsRes.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
          // 🔁 Auto restart listening after assistant reply finishes
          startListening();
        };

        await audio.play();
      }
    } catch (err) {
      console.error("Assistant error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20, background: "#111827", borderRadius: 12, color: "white" }}>
      <h2>Voice Chat (turn-taking)</h2>
      <p>Speak, wait, hear reply — it will auto-listen again like ChatGPT voice mode.</p>

      {!listening ? (
        <button onClick={startListening} style={{ padding: "10px 20px", marginBottom: 20 }}>
          🎙️ Start
        </button>
      ) : (
        <button onClick={stopListening} style={{ padding: "10px 20px", marginBottom: 20 }}>
          ⏹ Stop
        </button>
      )}

      <div style={{ margin: "1rem 0", padding: 10, background: "#1f2937", borderRadius: 8 }}>
        <strong>Transcript:</strong> {transcript || "..."}
      </div>

      <div>
        <h3>Conversation</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {conversation.map((m, i) => (
            <li key={i} style={{ margin: "8px 0" }}>
              <b style={{ color: m.role === "user" ? "#34d399" : "#60a5fa" }}>
                {m.role}:
              </b>{" "}
              {m.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
