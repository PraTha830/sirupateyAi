import { useEffect, useRef, useState } from "react";

export default function ChatDock({ onSend }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = true;
    r.onresult = (e) => {
      let finalTxt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        finalTxt += e.results[i][0].transcript;
      }
      setText((prev) => (prev ? prev + " " : "") + finalTxt.trim());
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recogRef.current = r;
    return () => { try { r.abort(); } catch {} };
  }, []);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    await onSend(t);
  };

  const toggleMic = () => {
    const r = recogRef.current;
    if (!r) { document.querySelector(".chat-dock input")?.focus(); return; }
    if (listening) { r.stop(); setListening(false); }
    else { try { r.start(); setListening(true); } catch { setListening(true); } }
  };

  return (
    <>
      <div className="chat-dock">
        <div className="chat-input">
          <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            placeholder="Type or use the mic…"
            onKeyDown={(e)=> e.key==='Enter' && send()}
          />
          <button aria-label="Send" onClick={send} className="send">➤</button>
          <button
            className={`mic ${listening ? "on" : ""}`}
            title={listening ? "Stop voice" : "Start voice"}
            onClick={toggleMic}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21H9v2h6v-2h-2v-3.08A7 7 0 0 0 19 11h-2Z"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        /* Larger fixed dock at bottom */
        .chat-dock {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 16px;
          width: min(1100px, 96vw);
          z-index: 50;
          pointer-events: none;
        }
        .chat-input {
          pointer-events: auto;
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 10px;
          align-items: center;
          background: var(--card);
          padding: 12px;
          border-radius: 16px;
          box-shadow: var(--shadow-2);
        }
        .chat-input input {
          width: 100%;
          padding: 14px 16px;     /* bigger */
          font-size: 1.05rem;     /* bigger text */
          border-radius: 12px;
          border: 1px solid color-mix(in oklab, var(--bg), white 14%);
          background: var(--bg);
          color: var(--fg);
          box-shadow: var(--shadow-1);
        }
        .chat-input button {
          height: 48px;           /* bigger buttons */
          min-width: 48px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: var(--shadow-1);
          background: var(--card);
          color: var(--fg);
          display: grid;
          place-items: center;
          font-size: 16px;
        }
        .chat-input button.mic.on {
          background: #22d3ee22;
          outline: 2px solid #22d3ee;
        }
        @media (max-width: 480px) {
          .chat-dock { bottom: 12px; width: 94vw; }
          .chat-input input { font-size: 1rem; }
        }
      `}</style>
    </>
  );
}
