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
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Your personal knowledge space
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Notes
              </h1>

              <p className="mt-2 text-slate-500">
                Capture your ideas, thoughts and important information.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Notes
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {notes.length} note
                {notes.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Notes</p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {notes.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Saved</p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {notes.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Status</p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                Active
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  {editingNote ? "✏️" : "📝"}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingNote ? "Edit Note" : "Create Note"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingNote
                    ? "Update your note details."
                    : "Write down something important."}
                </p>
              </div>

              <form
                onSubmit={
                  editingNote
                    ? handleUpdateNote
                    : handleCreateNote
                }
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Note title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. JavaScript concepts"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Content
                  </label>

                  <textarea
                    placeholder="Write your note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="8"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                >
                  {editingNote ? "Update Note" : "Add Note"}
                </button>

                {editingNote && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            {/* Notes List */}
            <div>
              <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      All Notes
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {notes.length} note
                      {notes.length !== 1 ? "s" : ""} saved
                    </p>
                  </div>

                  <div className="rounded-xl bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600">
                    Notes
                  </div>
                </div>
              </div>

              {notes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                    📝
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No notes yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Create your first note to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg">
                          📝
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row">
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {note.title}
                              </h3>

                              {note.content && (
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                                  {note.content}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0 gap-2">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteNote(note._id)
                                }
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                              Note
                            </span>

                            <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
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