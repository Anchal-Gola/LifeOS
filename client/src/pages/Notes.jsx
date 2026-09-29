import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../api/noteApi";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data.data);
    } catch (error) {
      console.error("Notes error:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      await createNote({
        title,
        content,
      });

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Create note error:", error);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      await updateNote(editingNote._id, {
        title,
        content,
      });

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Update note error:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (error) {
      console.error("Delete note error:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="relative min-h-full overflow-hidden bg-[#f8f7ff] px-5 py-8 text-slate-900 transition-colors dark:bg-[#100d18] dark:text-white sm:px-8">
        {/* Ambient background */}
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-pink-300/15 blur-3xl dark:bg-pink-600/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/10 blur-3xl dark:bg-fuchsia-600/10" />

        <div className="relative mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 overflow-hidden rounded-[30px] border border-purple-100 bg-white/90 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl dark:border-purple-500/15 dark:bg-[#17121f]/90">
            <div className="h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

            <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                  <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  Personal Knowledge
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  My Notes
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  Capture your ideas, thoughts and important information.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50/80 px-5 py-3 dark:border-purple-500/15 dark:bg-purple-500/[0.08]">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Total Notes
                </p>

                <p className="mt-1 text-lg font-black text-purple-600 dark:text-purple-300">
                  {notes.length} note{notes.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-400/10 blur-2xl" />

              <div className="relative">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Total Notes
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                  {notes.length}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Across your workspace
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-400/10 blur-2xl" />

              <div className="relative">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Saved
                </p>

                <p className="mt-2 text-3xl font-black text-pink-600 dark:text-pink-300">
                  {notes.length}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Ready whenever you need them
                </p>
              </div>
            </div>

            <div className="relative col-span-2 overflow-hidden rounded-2xl border border-fuchsia-100 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f] lg:col-span-1">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-fuchsia-400/10 blur-2xl" />

              <div className="relative">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Status
                </p>

                <p className="mt-2 text-3xl font-black text-purple-600 dark:text-purple-300">
                  Active
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Your knowledge space is active
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
              <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-pink-50 px-6 py-6 dark:border-purple-500/10 dark:from-purple-500/[0.08] dark:via-transparent dark:to-pink-500/[0.06]">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-lg ${
                      editingNote
                        ? "from-violet-600 to-pink-500 shadow-pink-500/20"
                        : "from-purple-600 to-fuchsia-500 shadow-purple-500/20"
                    }`}
                  >
                    {editingNote ? "✏️" : "📝"}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      {editingNote ? "Update" : "New Note"}
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                      {editingNote ? "Edit Note" : "Create Note"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form
                  onSubmit={
                    editingNote ? handleUpdateNote : handleCreateNote
                  }
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Note title
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. JavaScript concepts"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-white/[0.06] dark:focus:ring-purple-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Content
                    </label>

                    <textarea
                      placeholder="Write your note..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows="8"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-white/[0.06] dark:focus:ring-purple-500/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/20"
                  >
                    {editingNote ? "Update Note" : "Add Note"}
                  </button>

                  {editingNote && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                    >
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Notes List */}
            <div>
              <div className="mb-5 rounded-3xl border border-purple-100 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-500 dark:text-purple-400">
                      Knowledge Space
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                      All Notes
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {notes.length} note
                      {notes.length !== 1 ? "s" : ""} saved
                    </p>
                  </div>

                  <div className="rounded-xl border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600 dark:border-purple-500/15 dark:bg-purple-500/10 dark:text-purple-300">
                    Notes
                  </div>
                </div>
              </div>

              {notes.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-purple-200 bg-white px-6 py-20 text-center shadow-sm dark:border-purple-500/20 dark:bg-[#17121f]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-2xl dark:from-purple-500/10 dark:to-pink-500/10">
                    📝
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                    No notes yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Create your first note to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 dark:border-white/[0.07] dark:bg-[#17121f] dark:hover:border-purple-500/15 sm:p-6"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-600 via-purple-500 to-pink-500" />

                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-lg dark:from-purple-500/10 dark:to-pink-500/10">
                          📝
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-4 sm:flex-row">
                            <div className="min-w-0">
                              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                {note.title}
                              </h3>

                              {note.content && (
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500 dark:text-slate-400">
                                  {note.content}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0 gap-2">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="rounded-xl border border-purple-100 bg-white px-3.5 py-2 text-xs font-bold text-purple-600 transition hover:bg-purple-50 dark:border-purple-500/15 dark:bg-white/[0.03] dark:text-purple-300 dark:hover:bg-purple-500/10"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDeleteNote(note._id)}
                                className="rounded-xl border border-pink-100 bg-white px-3.5 py-2 text-xs font-bold text-pink-500 transition hover:bg-pink-50 dark:border-pink-500/15 dark:bg-white/[0.03] dark:text-pink-300 dark:hover:bg-pink-500/10"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600 dark:border-purple-500/15 dark:bg-purple-500/10 dark:text-purple-300">
                              Note
                            </span>

                            <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                              📅 {formatDate(note.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Notes;