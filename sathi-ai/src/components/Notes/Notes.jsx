// src/components/Notes/Notes.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import MainPage from "../../layout/Mainpage";
import NotesPanel from "../common/NotesPanel";
import ChatDock from "../common/ChatDock";
import SavedNotesSidebar from "./SavedNotesSidebar";
import { getNotes, createNote, updateNote, deleteNote } from "./notesApi";
import "./Notes.css";

export default function NotesPage({ userId = "demo-user-1" }) {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [entries, setEntries] = useState([]);   // chat I/O (optional)
  const [freeNote, setFreeNote] = useState(""); // scratch pad
  const [quickTask, setQuickTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "", tags: [] });


  const selected = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  /* 1) Centralized refetch */
  const refreshNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotes(userId); // pass {signal} if your API supports AbortController
      setNotes(data);
      setSelectedId(prev => prev ?? null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /* 2) Fetch on mount / when userId changes */
  useEffect(() => {
    let disposed = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getNotes(userId);
        if (!disposed) {
          setNotes(data);
          setSelectedId(prev => prev ?? (data[0]?.id ?? null));
        }
      } finally {
        if (!disposed) setLoading(false);
      }
    })();
    return () => { disposed = true; };
  }, [userId]);

//    useEffect(() => {
//     const id = setInterval(refreshNotes, 30_000); // every 30s
//     return () => clearInterval(id);               // cleanup on unmount
//   }, [refreshNotes]);

  /* 3) Mutations -> refresh */
  async function handleNew() {
    // await createNote({ user_id: userId, title: "Untitled", content: "", tags: [] });
    // await refreshNotes();
    setSelectedId(null);
    setDraft({ title: "", content: "", tags: [] });

  }

  async function handleDelete(idArg) {
    const id = idArg ?? selectedId;
    if (!id) {
        setDraft({ title: "", content: "", tags: [] });
        return;
    }
    await deleteNote(id);
    await refreshNotes();
    setSelectedId(null); // let refreshNotes choose the first note
  }

  async function handleSave() {
//     if (!selected) return;
//     const { id, title, content, tags } = selected;
//    // optimistic: keep local list in sync right away
//    setNotes(ns => ns.map(n => (n.id === id ? { ...n, title, content, tags } : n)));
//    try {
//      await updateNote(id, { title, content, tags });
//    } finally {
//      // pull fresh list in case backend changed order/timestamps
//      await refreshNotes();
//      setSelectedId(id);
//    }
// If no selected note, we're saving the draft => CREATE
    if (!selected) {
        const created = await createNote({
        user_id: userId,
        title: draft.title || "Untitled",
        content: draft.content || "",
        tags: draft.tags || [],
        });
        await refreshNotes();
        setSelectedId(created?.id ?? null); // jump into the saved note
        return;
    }
    // Otherwise UPDATE the selected note
    const { id, title, content, tags } = selected;
    setNotes(ns => ns.map(n => (n.id === id ? { ...n, title, content, tags } : n)));
    try {
        await updateNote(id, { title, content, tags });
    } finally {
        await refreshNotes();
        setSelectedId(id);
    }
  }

  // Quick task ⇒ append bullet to large body (title)
  async function addQuickTask() {
    const line = quickTask.trim();
    if (!selected || !line) return;
    const id = selected.id;
   const nextTitle = selected.title ? `${selected.title}\n• ${line}` : `• ${line}`;
   // optimistic local update
   setNotes(ns => ns.map(n => (n.id === id ? { ...n, title: nextTitle } : n)));
   setQuickTask("");
   try {
     await updateNote(id, { title: nextTitle });
   } finally {
     await refreshNotes();
     setSelectedId(id);
   }
  }

  // Chat → append quoted line to open note
  async function handleChat(text) {
    setEntries(e => [...e, { role: "user", text, ts: Date.now() }]);
    if (selected) {
      const appended = selected.title ? `${selected.title}\n\n> ${text}` : `> ${text}`;
      await updateNote(selected.id, { title: appended });
      await refreshNotes();
      setSelectedId(selected.id);
    }
    const reply = "Got it! I added your message to the open note.";
    setEntries(e => [...e, { role: "assistant", text: reply, ts: Date.now() }]);
    return reply;
  }

  return (
    <MainPage
      title="Note Taker"
      subtitle=""
      headerRight={<div className="logo-circle">Logo</div>}

      /* ===== Main: Current Note editor ===== */
    //   main={
    //     <section className="note-editor">
    //       <div className="note-editor__header">
    //         <h1 className="note-editor__title">Current Note</h1>
    //         <div className="note-editor__actions">
    //           <button onClick={handleSave} disabled={!selected || loading}>Save</button>
    //           <button onClick={() => handleDelete()} disabled={!selected || loading}>Delete</button>
    //         </div>
    //       </div>

    //       {loading && (
    //         <div className="note-empty">Loading notes…</div>
    //       )}

    //       {!loading && !selected && (
    //         <div className="note-empty">No note selected. Create a new note on the right.</div>
    //       )}

    //       {!loading && !!selected && (
    //         <>
    //           {/* small field: content */}
    //           <input
    //             className="note-field"
    //             value={selected.content}
    //             onChange={(e) =>
    //               setNotes(ns =>
    //                 ns.map(n => n.id === selected.id ? { ...n, content: e.target.value } : n)
    //               )
    //             }
    //             placeholder="LOG for work (short content)…"
    //           />

    //           {/* big body: title */}
    //           <textarea
    //             className="note-body"
    //             value={selected.title}
    //             onChange={(e) =>
    //               setNotes(ns =>
    //                 ns.map(n => n.id === selected.id ? { ...n, title: e.target.value } : n)
    //               )
    //             }
    //             placeholder="Write your note…"
    //             rows={12}
    //           />

    //           {/* quick task */}
    //           <div className="note-quick">
    //             <input
    //               value={quickTask}
    //               onChange={(e) => setQuickTask(e.target.value)}
    //               onKeyDown={(e) => e.key === "Enter" && addQuickTask()}
    //               placeholder="Type here… new task/line"
    //             />
    //             <button onClick={addQuickTask} disabled={!quickTask.trim() || loading}>Add</button>
    //           </div>

    //           {/* tags */}
    //           <input
    //             className="note-tags"
    //             value={(selected.tags || []).join(", ")}
    //             onChange={(e) =>
    //               setNotes(ns =>
    //                 ns.map(n =>
    //                   n.id === selected.id
    //                     ? {
    //                         ...n,
    //                         tags: e.target.value
    //                           .split(",")
    //                           .map(s => s.trim())
    //                           .filter(Boolean),
    //                       }
    //                     : n
    //                 )
    //               )
    //             }
    //             placeholder="Tags (comma separated)"
    //           />
    //         </>
    //       )}
    //     </section>
      //}
      main={
        <section className="note-editor">
            <div className="note-editor__header">
            <h1 className="note-editor__title">Current Note</h1>
            <div className="note-editor__actions">
                <button onClick={handleSave} disabled={loading}>Save</button>
                <button onClick={() => handleDelete()} disabled={loading}>Delete</button>
            </div>
            </div>

            {loading && <div className="note-empty">Loading notes…</div>}

            {!loading && !selected && (
            <>
                <input
                className="note-field"
                value={draft.content}
                onChange={(e) => setDraft(d => ({ ...d, content: e.target.value }))}
                placeholder="Untitled (short content)…"
                />

                <textarea
                className="note-body"
                value={draft.title}
                onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Write your note…"
                rows={12}
                />

                <div className="note-quick">
                <input
                    value={quickTask}
                    onChange={(e) => setQuickTask(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" && quickTask.trim()) {
                        setDraft(d => ({
                        ...d,
                        title: d.title ? `${d.title}\n• ${quickTask.trim()}` : `• ${quickTask.trim()}`,
                        }));
                        setQuickTask("");
                    }
                    }}
                    placeholder="Type here… new task/line"
                />
                <button
                    onClick={() => {
                    if (!quickTask.trim()) return;
                    setDraft(d => ({
                        ...d,
                        title: d.title ? `${d.title}\n• ${quickTask.trim()}` : `• ${quickTask.trim()}`,
                    }));
                    setQuickTask("");
                    }}
                    disabled={!quickTask.trim() || loading}
                >
                    Add
                </button>
                </div>

                <input
                className="note-tags"
                value={(draft.tags || []).join(", ")}
                onChange={(e) =>
                    setDraft(d => ({
                    ...d,
                    tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                    }))
                }
                placeholder="Tags (comma separated)"
                />
            </>
            )}

            {!loading && !!selected && (
            <>
                {/* existing selected-note fields (unchanged) */}
                <input
                className="note-field"
                value={selected.content}
                onChange={(e) =>
                    setNotes(ns =>
                    ns.map(n => n.id === selected.id ? { ...n, content: e.target.value } : n)
                    )
                }
                placeholder="LOG for work (short content)…"
                />

                <textarea
                className="note-body"
                value={selected.title}
                onChange={(e) =>
                    setNotes(ns =>
                    ns.map(n => n.id === selected.id ? { ...n, title: e.target.value } : n)
                    )
                }
                placeholder="Write your note…"
                rows={12}
                />

                <div className="note-quick">
                <input
                    value={quickTask}
                    onChange={(e) => setQuickTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addQuickTask()}
                    placeholder="Add bullets ... (get groceries)"
                />
                <button onClick={addQuickTask} disabled={!quickTask.trim() || loading}>Add</button>
                </div>

                <input
                className="note-tags"
                value={(selected.tags || []).join(", ")}
                onChange={(e) =>
                    setNotes(ns =>
                    ns.map(n =>
                        n.id === selected.id
                        ? {
                            ...n,
                            tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean),
                            }
                        : n
                    )
                    )
                }
                placeholder="Tags (comma separated)"
                />
            </>
            )}

        </section>
      }


      /* ===== Right column: Saved notes sidebar ===== */
      rightRail={
        <SavedNotesSidebar
            notes={notes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNew={handleNew}
            onDelete={handleDelete}
        />
      }

      /* ===== Bottom panes ===== */
      //notes={<NotesPanel entries={entries} value={freeNote} onChange={setFreeNote} />}
      //chat={<ChatDock onSend={handleChat} />}
    />
  );
}
