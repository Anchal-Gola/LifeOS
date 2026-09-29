import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  addTopic,
  toggleTopic,
} from "../api/studyWorkspaceApi";

function StudyWorkspace() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      const data = response.data.data || [];

      setSubjects(data);

      if (selectedSubject) {
        const updated = data.find(
          (item) => item._id === selectedSubject._id
        );

        setSelectedSubject(updated || null);
      }
    } catch (error) {
      console.error("Study workspace error:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateSubject = async (e) => {
    e.preventDefault();

    if (!subject.trim() || loading) return;

    try {
      setLoading(true);
      await createSubject(subject.trim());
      setSubject("");
      await fetchSubjects();
    } catch (error) {
      console.error("Create subject error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubject = (item) => {
    setSelectedSubject(item);
    setTopic("");
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);

      if (selectedSubject?._id === id) {
        setSelectedSubject(null);
      }

      await fetchSubjects();
    } catch (error) {
      console.error("Delete subject error:", error);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();

    if (!selectedSubject || !topic.trim()) return;

    try {
      await addTopic(selectedSubject._id, topic.trim());
      setTopic("");
      await fetchSubjects();
    } catch (error) {
      console.error("Add topic error:", error);
    }
  };

  const handleToggleTopic = async (topicId) => {
    if (!selectedSubject) return;

    try {
      await toggleTopic(selectedSubject._id, topicId);
      await fetchSubjects();
    } catch (error) {
      console.error("Toggle topic error:", error);
    }
  };

  const progress = useMemo(() => {
    if (!selectedSubject?.topics?.length) return 0;

    const completed = selectedSubject.topics.filter(
      (item) => item.completed
    ).length;

    return Math.round(
      (completed / selectedSubject.topics.length) * 100
    );
  }, [selectedSubject]);

  const totalTopics = subjects.reduce(
    (total, item) => total + (item.topics?.length || 0),
    0
  );

  const completedTopics = subjects.reduce(
    (total, item) =>
      total +
      (item.topics?.filter((topicItem) => topicItem.completed)
        .length || 0),
    0
  );

  return (
    <MainLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#f8f7ff] px-5 py-7 text-slate-900 transition-colors sm:px-6 lg:px-8 dark:bg-[#100d18] dark:text-white">
        {/* Ambient purple / pink glow */}
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" />
        <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-pink-300/15 blur-3xl dark:bg-pink-600/10" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-300/10 blur-3xl dark:bg-fuchsia-600/10" />

        <div className="relative mx-auto max-w-7xl">

          {/* HERO */}
          <div className="relative mb-8 overflow-hidden rounded-[30px] border border-purple-100 bg-white/90 shadow-[0_20px_60px_rgba(124,58,237,0.10)] backdrop-blur-xl dark:border-purple-500/15 dark:bg-[#17121f]/90 dark:shadow-[0_20px_60px_rgba(168,85,247,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-500/10" />
            <div className="absolute right-28 top-10 h-44 w-44 rounded-full bg-pink-400/10 blur-3xl dark:bg-pink-500/10" />

            <div className="relative px-6 py-8 sm:px-8">
              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-purple-700 shadow-sm dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_9px_rgba(168,85,247,0.9)]" />
                    Study Workspace
                  </div>

                  <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl dark:text-white">
                    Study smarter.
                    <span className="ml-2 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-pink-400">
                      Track everything.
                    </span>
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Organize your subjects, break them into topics,
                    and keep track of what you have completed.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50/80 px-4 py-3 shadow-sm dark:border-purple-500/15 dark:bg-purple-500/[0.08]">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Subjects
                    </p>
                    <p className="mt-1 text-xl font-bold text-purple-700 dark:text-purple-300">
                      {subjects.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/80 px-4 py-3 shadow-sm dark:border-fuchsia-500/15 dark:bg-fuchsia-500/[0.08]">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400">
                      Topics
                    </p>
                    <p className="mt-1 text-xl font-bold text-fuchsia-700 dark:text-fuchsia-300">
                      {totalTopics}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-pink-100 bg-pink-50/80 px-4 py-3 shadow-sm dark:border-pink-500/15 dark:bg-pink-500/[0.08]">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">
                      Done
                    </p>
                    <p className="mt-1 text-xl font-bold text-pink-700 dark:text-pink-300">
                      {completedTopics}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ADD SUBJECT */}
          <div className="group relative mb-7 overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm transition hover:shadow-lg hover:shadow-purple-500/10 dark:border-purple-500/10 dark:bg-[#17121f]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

            <div className="flex flex-col gap-5 p-5 pt-6 sm:p-6 sm:pt-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-lg font-medium text-white shadow-lg shadow-purple-500/25">
                    +
                  </span>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Add a subject
                  </h2>
                </div>

                <p className="ml-12 text-xs text-slate-400">
                  Create a new subject and start organizing its topics.
                </p>
              </div>

              <form
                onSubmit={handleCreateSubject}
                className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl"
              >
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-white/[0.06]"
                />

                <button
                  type="submit"
                  disabled={loading || !subject.trim()}
                  className="rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {loading ? "Adding..." : "Add Subject"}
                </button>
              </form>
            </div>
          </div>

          {/* WORKSPACE */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[330px_1fr]">

            {/* SUBJECTS */}
            <div className="overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
              <div className="relative overflow-hidden border-b border-slate-100 px-5 py-5 dark:border-white/[0.06]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-purple-300/20 blur-2xl dark:bg-purple-500/10" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Your Subjects
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      Select one to manage topics.
                    </p>
                  </div>

                  <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                    {subjects.length}
                  </span>
                </div>
              </div>

              <div className="max-h-[560px] overflow-y-auto p-3">
                {subjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-purple-200 px-5 py-12 text-center dark:border-purple-500/15">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 text-xl text-purple-600 dark:from-purple-500/10 dark:to-pink-500/10 dark:text-purple-300">
                      ◈
                    </div>

                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      No subjects yet
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Add your first subject above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subjects.map((item) => {
                      const active =
                        selectedSubject?._id === item._id;

                      const total = item.topics?.length || 0;

                      const completed =
                        item.topics?.filter(
                          (topicItem) => topicItem.completed
                        ).length || 0;

                      const subjectProgress = total
                        ? Math.round((completed / total) * 100)
                        : 0;

                      return (
                        <div
                          key={item._id}
                          className={`group relative overflow-hidden rounded-2xl border transition ${
                            active
                              ? "border-purple-200 bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50/70 shadow-md shadow-purple-500/10 dark:border-purple-500/20 dark:from-purple-500/10 dark:via-fuchsia-500/[0.07] dark:to-pink-500/[0.05]"
                              : "border-transparent hover:border-purple-100 hover:bg-purple-50/40 dark:hover:border-white/[0.06] dark:hover:bg-white/[0.035]"
                          }`}
                        >
                          {active && (
                            <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-violet-600 via-purple-500 to-pink-500" />
                          )}

                          <div className="flex items-center">
                            <button
                              onClick={() => handleSelectSubject(item)}
                              className="min-w-0 flex-1 px-3.5 py-3.5 text-left"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                                    active
                                      ? "bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-md shadow-purple-500/25"
                                      : "bg-purple-50 text-purple-400 dark:bg-white/[0.06] dark:text-purple-300"
                                  }`}
                                >
                                  {item.subject
                                    ?.charAt(0)
                                    ?.toUpperCase() || "S"}
                                </span>

                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`truncate text-sm font-semibold ${
                                      active
                                        ? "text-purple-700 dark:text-purple-300"
                                        : "text-slate-700 dark:text-slate-300"
                                    }`}
                                  >
                                    {item.subject}
                                  </p>

                                  <div className="mt-1.5 flex items-center gap-2">
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/[0.08]">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500"
                                        style={{
                                          width: `${subjectProgress}%`,
                                        }}
                                      />
                                    </div>

                                    <span className="text-[10px] font-medium text-slate-400">
                                      {completed}/{total}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteSubject(item._id)
                              }
                              title="Delete subject"
                              className="mr-2 rounded-lg p-2 text-xs text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* SELECTED SUBJECT */}
            <div>
              {!selectedSubject ? (
                <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-[24px] border border-purple-100 bg-white p-8 text-center shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
                  <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-300/15 blur-3xl dark:bg-purple-500/[0.08]" />

                  <div className="relative max-w-md">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-2xl text-white shadow-xl shadow-purple-500/25">
                      📚
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Select a subject
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Choose a subject from your workspace to start
                      managing your study topics and tracking progress.
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {["Subjects", "Topics", "Progress"].map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-[11px] font-semibold text-purple-500 dark:border-purple-500/15 dark:bg-purple-500/10 dark:text-purple-300"
                          >
                            {item}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">

                  {/* SUBJECT HEADER */}
                  <div className="relative overflow-hidden border-b border-slate-100 p-6 dark:border-white/[0.06] sm:p-7">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />
                    <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-purple-400/15 blur-3xl dark:bg-purple-500/[0.08]" />
                    <div className="pointer-events-none absolute right-20 top-5 h-36 w-36 rounded-full bg-pink-400/10 blur-3xl dark:bg-pink-500/[0.08]" />

                    <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-lg text-white shadow-lg shadow-purple-500/25">
                          ◈
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 dark:text-purple-400">
                            Current Subject
                          </p>

                          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {selectedSubject.subject}
                          </h2>

                          <p className="mt-1 text-xs text-slate-400">
                            {selectedSubject.topics?.length || 0} topics
                            in this subject
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-[210px]">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Overall progress
                          </span>

                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {progress}%
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 shadow-inner dark:bg-white/[0.07]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.4)] transition-all duration-300"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOPICS */}
                  <div className="p-6 sm:p-7">
                    <form
                      onSubmit={handleAddTopic}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Add a topic..."
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-white/[0.06]"
                      />

                      <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                      >
                        Add Topic
                      </button>
                    </form>

                    <div className="mt-8">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Topics
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            Click a topic to mark it complete.
                          </p>
                        </div>

                        <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                          {selectedSubject.topics?.length || 0}
                        </span>
                      </div>

                      {selectedSubject.topics?.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/30 py-12 text-center dark:border-purple-500/[0.12] dark:bg-purple-500/[0.02]">
                          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 text-purple-600 dark:from-purple-500/10 dark:to-pink-500/10 dark:text-purple-300">
                            +
                          </div>

                          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            No topics yet
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Add your first topic above.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {selectedSubject.topics.map((item) => (
                            <button
                              key={item._id}
                              onClick={() =>
                                handleToggleTopic(item._id)
                              }
                              className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-purple-200 hover:bg-gradient-to-r hover:from-violet-50/60 hover:via-purple-50/50 hover:to-pink-50/40 hover:shadow-md hover:shadow-purple-500/5 dark:border-white/[0.07] dark:bg-white/[0.02] dark:hover:border-purple-500/20 dark:hover:from-purple-500/[0.06] dark:hover:to-pink-500/[0.04]"
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                                  item.completed
                                    ? "border-purple-500 bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-md shadow-purple-500/25"
                                    : "border-slate-300 text-transparent group-hover:border-purple-400 dark:border-slate-600 dark:group-hover:border-purple-500/50"
                                }`}
                              >
                                ✓
                              </span>

                              <span
                                className={`flex-1 text-sm font-medium ${
                                  item.completed
                                    ? "text-slate-400 line-through dark:text-slate-500"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {item.title}
                              </span>

                              <span
                                className={`text-xs font-medium ${
                                  item.completed
                                    ? "text-purple-500"
                                    : "text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600"
                                }`}
                              >
                                {item.completed
                                  ? "Completed"
                                  : "Mark done"}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default StudyWorkspace;