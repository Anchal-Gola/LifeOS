import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useTheme } from "../context/ThemeContext";

import {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
} from "../api/journalApi";

function Journal() {
  const { darkMode } = useTheme();

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
      happy: "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
      sad: "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
      neutral:
        "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
      excited:
        "border-pink-100 bg-pink-50 text-pink-600 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-400",
      angry:
        "border-red-100 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
      calm: "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
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
      .sort((a, b) => new Date(b.date) - new Date(a.date));
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
      <div className="min-h-full bg-[#f8f8fc] px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* HERO */}
          <section className="relative mb-7 overflow-hidden rounded-[28px] border border-purple-100 bg-white px-6 py-7 shadow-[0_16px_50px_rgba(124,58,237,0.07)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:px-8 lg:px-10">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20" />
            <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-pink-100/40 blur-3xl dark:bg-pink-900/10" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Personal Reflection
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 transition-colors dark:text-white sm:text-4xl">
                  My Journal
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  A private space to capture your thoughts, feelings,
                  experiences, and moments that matter.
                </p>
              </div>

              <div className="relative rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-4 transition-colors dark:border-slate-800 dark:bg-slate-800/70 lg:min-w-[190px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Today
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {todayJournals}
                  </span>

                  <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">
                    {todayJournals === 1 ? "entry" : "entries"}
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{
                      width: `${Math.min(todayJournals * 35, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                icon: "✦",
                label: "Total Entries",
                value: journals.length,
                box: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
              },
              {
                icon: "◷",
                label: "Today",
                value: todayJournals,
                box: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
              },
              {
                icon: "😊",
                label: "Happy",
                value: moodCounts.happy || 0,
                box: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
              },
              {
                icon: "😌",
                label: "Calm",
                value: moodCounts.calm || 0,
                box: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-colors duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.box}`}
                >
                  {stat.icon}
                </div>

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          {/* MAIN WORKSPACE */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* WRITING PANEL */}
            <aside className="h-fit overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="relative overflow-hidden border-b border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-6 dark:border-slate-800 dark:from-purple-950/30 dark:via-slate-900 dark:to-pink-950/20">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl dark:bg-purple-700/10" />

                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm ring-1 ring-purple-100 dark:bg-slate-800 dark:ring-slate-700">
                    {editingJournal ? "✏️" : "📖"}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {editingJournal ? "Edit Entry" : "Write Journal"}
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {editingJournal
                        ? "Make changes to your reflection."
                        : "Put your thoughts into words."}
                    </p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={
                  editingJournal
                    ? handleUpdateJournal
                    : handleCreateJournal
                }
                className="space-y-5 p-6"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Title
                  </label>

                  <input
                    type="text"
                    placeholder="A productive day..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-slate-800 dark:focus:ring-purple-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Mood
                  </label>

                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Your thoughts
                    </label>

                    <span className="text-[11px] text-slate-400">
                      {content.length} characters
                    </span>
                  </div>

                  <textarea
                    placeholder="Write about your day..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="8"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-slate-800 dark:focus:ring-purple-500/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {editingJournal ? "Update Entry" : "Save Journal"}
                </button>

                {editingJournal && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </aside>

            {/* JOURNAL LIST */}
            <section className="min-w-0">

              {/* FILTER BAR */}
              <div className="mb-6 rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-sm">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ⌕
                    </span>

                    <input
                      type="text"
                      placeholder="Search your journal..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-slate-800 dark:focus:ring-purple-500/10"
                    />
                  </div>

                  <select
                    value={moodFilter}
                    onChange={(e) => setMoodFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-purple-300 focus:ring-4 focus:ring-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
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

              {/* LIST HEADER */}
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-500 dark:text-purple-400">
                    Your reflections
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                    Journal Entries
                  </h2>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {filteredJournals.length}{" "}
                  {filteredJournals.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              {filteredJournals.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-3xl dark:bg-purple-500/10">
                    📖
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    No journal entries
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Start writing to capture your thoughts and
                    create your personal reflection history.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJournals.map((journal) => (
                    <article
                      key={journal._id}
                      className="group rounded-[22px] border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-purple-100 hover:shadow-[0_14px_38px_rgba(124,58,237,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-purple-500/20 sm:p-6"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${getMoodStyle(
                            journal.mood
                          )}`}
                        >
                          {getMoodEmoji(journal.mood)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row">
                            <div className="min-w-0">
                              <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
                                {journal.title}
                              </h3>

                              <p className="mt-1 text-xs font-medium text-slate-400">
                                {formatDate(journal.date)}
                              </p>
                            </div>

                            <div className="flex shrink-0 gap-1">
                              <button
                                onClick={() =>
                                  handleEditJournal(journal)
                                }
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-purple-50 hover:text-purple-600 dark:text-slate-400 dark:hover:bg-purple-500/10 dark:hover:text-purple-400"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteJournal(journal._id)
                                }
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {journal.content}
                          </p>

                          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                            <span
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getMoodStyle(
                                journal.mood
                              )}`}
                            >
                              {getMoodEmoji(journal.mood)}{" "}
                              {journal.mood}
                            </span>

                            <span className="text-[11px] font-medium text-slate-300 dark:text-slate-600">
                              LifeOS Journal
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Journal;