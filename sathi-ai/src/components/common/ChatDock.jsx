import { useState } from "react";

export default function ChatDock({ onSend }) {
  const [text, setText] = useState("");

  const send = async () => {
    if (!text.trim()) return;
    const copy = text;
    setText("");
    await onSend(copy);          // parent handles logging both user & assistant
  };

  return (
    <div className="chat-dock">
      <div className="chat-input">
        <input
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Type your visa/career question…"
          onKeyDown={(e)=> e.key==='Enter' && send()}
        />
        <button aria-label="Send" onClick={send}>➤</button>
        <button className="info" title="What can I ask?">ℹ️</button>
      </div>

      <style>{`
        .chat-dock { position: sticky; bottom: 12px; margin-top: 16px; }
        .chat-input { display:grid; grid-template-columns:1fr auto auto; gap:8px; align-items:center; }
        .chat-input input {
          width:100%; padding:12px 14px; border-radius:10px; border:2px solid #0000;
          background: var(--bg); color: var(--fg); box-shadow: var(--shadow-1);
        }
        .chat-input button {
          height:42px; min-width:44px; border:none; border-radius:10px; cursor:pointer;
          box-shadow: var(--shadow-1); background: var(--card); color: var(--fg);
        }
      `}</style>
    </div>
  );
}
