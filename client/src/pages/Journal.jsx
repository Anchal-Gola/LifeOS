import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from "../api/journalApi";

function Journal() {
  const [journals, setJournals] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [date, setDate] = useState("");

  const [editingJournal, setEditingJournal] = useState(null);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("All");

  const fetchJournals = async () => {
    try {
      const data = await getJournals();
      setJournals(data.data || []);
    } catch (error) {
      console.error("Journals error:", error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("neutral");
    setDate("");
    setEditingJournal(null);
  };

  const handleCreateJournal = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      await createJournal({
        title,
        content,
        mood,
        date: date || undefined,
      });

      resetForm();
      fetchJournals();
    } catch (error) {
      console.error("Create journal error:", error);
    }
  };

  const handleEditJournal = (journal) => {
    setEditingJournal(journal);

    setTitle(journal.title);
    setContent(journal.content);
    setMood(journal.mood || "neutral");

    setDate(
      journal.date
        ? new Date(journal.date).toISOString().split("T")[0]
        : ""
    );
  };

  const handleUpdateJournal = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      await updateJournal(editingJournal._id, {
        title,
        content,
        mood,
        date: date || undefined,
      });

      resetForm();
      fetchJournals();
    } catch (error) {
      console.error("Update journal error:", error);
    }
  };

  const handleDeleteJournal = async (id) => {
    try {
      await deleteJournal(id);
      fetchJournals();
    } catch (error) {
      console.error("Delete journal error:", error);
    }
  };

  const getMoodStyle = (journalMood) => {
    const styles = {
      happy: "bg-yellow-50 text-yellow-600 border-yellow-100",
      sad: "bg-blue-50 text-blue-600 border-blue-100",
      neutral: "bg-slate-50 text-slate-600 border-slate-100",
      excited: "bg-pink-50 text-pink-600 border-pink-100",
      angry: "bg-red-50 text-red-600 border-red-100",
      calm: "bg-green-50 text-green-600 border-green-100",
    };

    return styles[journalMood] || styles.neutral;
  };

  const getMoodEmoji = (journalMood) => {
    const emojis = {
      happy: "😊",
      sad: "😔",
      neutral: "😐",
      excited: "🤩",
      angry: "😠",
      calm: "😌",
    };

    return emojis[journalMood] || "😐";
  };

  const formatDate = (journalDate) => {
    return new Date(journalDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredJournals = useMemo(() => {
    return [...journals]
      .filter((journal) => {
        const searchText = search.toLowerCase();

        const searchMatch =
          journal.title.toLowerCase().includes(searchText) ||
          journal.content.toLowerCase().includes(searchText);

        const moodMatch =
          moodFilter === "All" || journal.mood === moodFilter;

        return searchMatch && moodMatch;
      })
      .sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
  }, [journals, search, moodFilter]);

  const todayString = new Date().toDateString();

  const todayJournals = journals.filter(
    (journal) =>
      new Date(journal.date).toDateString() === todayString
  ).length;

  const moodCounts = journals.reduce((counts, journal) => {
    counts[journal.mood] = (counts[journal.mood] || 0) + 1;
    return counts;
  }, {});

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Your personal reflection space
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Journal
              </h1>

              <p className="mt-2 text-slate-500">
                Capture your thoughts, feelings and daily experiences.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Today
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {todayJournals} journal
                {todayJournals !== 1 ? "s" : ""} written
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Entries</p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {journals.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Today</p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {todayJournals}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Happy</p>

              <p className="mt-2 text-2xl font-bold text-yellow-500">
                {moodCounts.happy || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Calm</p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {moodCounts.calm || 0}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  {editingJournal ? "✏️" : "📖"}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingJournal
                    ? "Edit Entry"
                    : "Write Journal"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingJournal
                    ? "Update your journal entry."
                    : "Write down what's on your mind."}
                </p>
              </div>

              <form
                onSubmit={
                  editingJournal
                    ? handleUpdateJournal
                    : handleCreateJournal
                }
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. A productive day"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    How are you feeling?
                  </label>

                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😔 Sad</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="angry">😠 Angry</option>
                    <option value="calm">😌 Calm</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Your thoughts
                  </label>

                  <textarea
                    placeholder="Write about your day..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="7"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                >
                  {editingJournal
                    ? "Update Entry"
                    : "Save Journal"}
                </button>

                {editingJournal && (
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

            {/* Journal List */}
            <div>

              {/* Filters */}
              <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <input
                    type="text"
                    placeholder="Search journal entries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 sm:max-w-xs"
                  />

                  <select
                    value={moodFilter}
                    onChange={(e) => setMoodFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-purple-400"
                  >
                    <option value="All">All Moods</option>
                    <option value="happy">Happy</option>
                    <option value="sad">Sad</option>
                    <option value="neutral">Neutral</option>
                    <option value="excited">Excited</option>
                    <option value="angry">Angry</option>
                    <option value="calm">Calm</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Journal Entries
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredJournals.length} entr
                  {filteredJournals.length !== 1 ? "ies" : "y"} shown
                </p>
              </div>

              {filteredJournals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                    📖
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No journal entries
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Start writing to capture your thoughts.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredJournals.map((journal) => (
                    <div
                      key={journal._id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl">
                          {getMoodEmoji(journal.mood)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row">
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {journal.title}
                              </h3>

                              <p className="mt-1 text-xs text-slate-400">
                                {formatDate(journal.date)}
                              </p>
                            </div>

                            <div className="flex shrink-0 gap-2">
                              <button
                                onClick={() =>
                                  handleEditJournal(journal)
                                }
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteJournal(journal._id)
                                }
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {journal.content}
                          </p>

                          <div className="mt-4">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getMoodStyle(
                                journal.mood
                              )}`}
                            >
                              {getMoodEmoji(journal.mood)}{" "}
                              {journal.mood}
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

export default Journal;