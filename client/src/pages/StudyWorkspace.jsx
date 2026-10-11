import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { createStudy } from "../api/studyApi";
import {
  createSubject,
  getSubjects,
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

  const [timerTopicId, setTimerTopicId] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerStatus, setTimerStatus] = useState("idle");
  const [timerMessage, setTimerMessage] = useState("");

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

  useEffect(() => {
    if (timerStatus !== "running") return;

    const interval = window.setInterval(() => {
      setTimerSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerStatus]);

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
    if (timerStatus === "running" || timerStatus === "saving") {
      setTimerMessage("Pause or finish your current session first.");
      return;
    }

    setSelectedSubject(item);
    setTopic("");
    setTimerTopicId("");
    setTimerMessage("");
  };

  const handleDeleteSubject = async (id) => {
    if (timerStatus === "running" || timerStatus === "saving") {
      setTimerMessage("Pause or finish your session before deleting a subject.");
      return;
    }

    try {
      await deleteSubject(id);

      if (selectedSubject?._id === id) {
        setSelectedSubject(null);
        setTimerTopicId("");
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [hours, minutes, remainingSeconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const startTimer = () => {
    if (!selectedSubject || !timerTopicId) {
      setTimerMessage("Please select a topic first.");
      return;
    }

    setTimerMessage("");
    setTimerStatus("running");
  };

  const pauseTimer = () => {
    setTimerStatus("paused");
  };

  const resetTimer = () => {
    setTimerStatus("idle");
    setTimerSeconds(0);
    setTimerMessage("");
  };

  const finishTimer = async () => {
    if (timerSeconds < 60) {
      setTimerMessage("Study for at least one minute before saving.");
      return;
    }

    const selectedTopic = selectedSubject?.topics?.find(
      (item) => item._id === timerTopicId
    );

    if (!selectedTopic) {
      setTimerMessage("Please select a valid topic.");
      return;
    }

    try {
      setLoading(true);
      setTimerStatus("saving");
      setTimerMessage("");

      await createStudy({
        subject: selectedSubject.subject,
        topic: selectedTopic.title,
        duration: Math.max(1, Math.round(timerSeconds / 60)),
        date: new Date().toISOString(),
        notes: "Recorded using the Study Workspace timer.",
      });

      setTimerStatus("idle");
      setTimerSeconds(0);
      setTimerMessage("Study session saved successfully!");
    } catch (error) {
      console.error("Save study session error:", error);
      setTimerStatus("paused");
      setTimerMessage(
        error.response?.data?.message ||
          "Unable to save the session. Please try again."
      );
    } finally {
      setLoading(false);
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
      (item.topics?.filter((topicItem) => topicItem.completed).length || 0),
    0
  );

  return (
    <MainLayout>
      <div className="relative min-h-screen overflow-hidden bg-[#f8f7ff] px-5 py-7 text-slate-900 sm:px-6 lg:px-8 dark:bg-[#100d18] dark:text-white">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-pink-300/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="relative mb-8 overflow-hidden rounded-[30px] border border-purple-100 bg-white/90 shadow-lg dark:border-purple-500/15 dark:bg-[#17121f]">
            <div className="h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

            <div className="flex flex-col justify-between gap-6 px-6 py-8 lg:flex-row lg:items-center">
              <div>
                <span className="mb-4 inline-block rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                  Study Workspace
                </span>

                <h1 className="text-3xl font-bold sm:text-4xl">
                  Study smarter.{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                    Track everything.
                  </span>
                </h1>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Organize subjects, track topics, and record your study time.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Subjects", subjects.length],
                  ["Topics", totalTopics],
                  ["Done", completedTopics],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 dark:border-purple-500/15 dark:bg-purple-500/10"
                  >
                    <p className="text-xs text-purple-600 dark:text-purple-300">
                      {label}
                    </p>
                    <p className="mt-1 text-xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ADD SUBJECT */}
          <div className="mb-7 rounded-[24px] border border-purple-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#17121f]">
            <h2 className="mb-4 font-bold">Add a subject</h2>

            <form
              onSubmit={handleCreateSubject}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-400 dark:border-white/10 dark:bg-white/5"
              />

              <button
                type="submit"
                disabled={loading || !subject.trim()}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                Add Subject
              </button>
            </form>
          </div>

          {/* MAIN WORKSPACE */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[330px_1fr]">
            {/* SUBJECT LIST */}
            <div className="rounded-[24px] border border-purple-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#17121f]">
              <h2 className="mb-4 font-bold">Your Subjects</h2>

              {subjects.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  No subjects yet. Add one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {subjects.map((item) => {
                    const active = selectedSubject?._id === item._id;
                    const total = item.topics?.length || 0;
                    const completed =
                      item.topics?.filter((topicItem) => topicItem.completed)
                        .length || 0;

                    return (
                      <div
                        key={item._id}
                        className={`flex items-center gap-2 rounded-xl border p-3 ${
                          active
                            ? "border-purple-300 bg-purple-50 dark:border-purple-500/30 dark:bg-purple-500/10"
                            : "border-transparent hover:bg-purple-50/50 dark:hover:bg-white/5"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectSubject(item)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-semibold">
                            {item.subject}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {completed}/{total} topics completed
                          </p>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-pink-500"
                              style={{
                                width: `${
                                  total ? (completed / total) * 100 : 0
                                }%`,
                              }}
                            />
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(item._id)}
                          className="rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SELECTED SUBJECT */}
            <div className="overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#17121f]">
              {!selectedSubject ? (
                <div className="flex min-h-[350px] items-center justify-center p-8 text-center">
                  <div>
                    <div className="mb-4 text-4xl">📚</div>
                    <h2 className="text-xl font-bold">Select a subject</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Choose a subject to manage topics and start studying.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* SUBJECT HEADER */}
                  <div className="border-b border-slate-100 p-6 dark:border-white/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
                      Current Subject
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">
                      {selectedSubject.subject}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedSubject.topics?.length || 0} topics
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Overall progress
                      </span>
                      <span className="font-bold text-purple-600">
                        {progress}%
                      </span>
                    </div>

                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-pink-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* STUDY TIMER */}
                  <div className="border-b border-slate-100 bg-purple-50/50 p-6 dark:border-white/10 dark:bg-purple-500/5">
                    <h3 className="text-lg font-bold">Study Timer</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Select a topic and record your actual study time.
                    </p>

                    <select
                      value={timerTopicId}
                      disabled={
                        timerStatus === "running" ||
                        timerStatus === "saving"
                      }
                      onChange={(e) => {
                        setTimerTopicId(e.target.value);
                        setTimerMessage("");
                      }}
                      className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple-400 dark:border-white/10 dark:bg-[#17121f]"
                    >
                      <option value="">Choose a topic</option>
                      {(selectedSubject.topics || []).map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </select>

                    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-purple-100 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-mono text-3xl font-bold tracking-wider sm:text-4xl">
                          {formatTime(timerSeconds)}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {timerStatus === "running"
                            ? "Timer running"
                            : timerStatus === "paused"
                            ? "Timer paused"
                            : timerStatus === "saving"
                            ? "Saving session..."
                            : "Ready to focus"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {timerStatus === "idle" && (
                          <button
                            type="button"
                            onClick={startTimer}
                            disabled={!timerTopicId}
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                          >
                            Start Timer
                          </button>
                        )}

                        {timerStatus === "running" && (
                          <button
                            type="button"
                            onClick={pauseTimer}
                            className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
                          >
                            Pause
                          </button>
                        )}

                        {timerStatus === "paused" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setTimerMessage("");
                                setTimerStatus("running");
                              }}
                              className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white"
                            >
                              Resume
                            </button>

                            <button
                              type="button"
                              onClick={resetTimer}
                              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold dark:border-white/10"
                            >
                              Discard
                            </button>

                            <button
                              type="button"
                              onClick={finishTimer}
                              disabled={loading}
                              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                            >
                              Finish Session
                            </button>
                          </>
                        )}

                        {timerStatus === "saving" && (
                          <button
                            type="button"
                            disabled
                            className="rounded-xl bg-purple-400 px-4 py-3 text-sm font-semibold text-white"
                          >
                            Saving...
                          </button>
                        )}
                      </div>
                    </div>

                    {timerMessage && (
                      <p
                        role="status"
                        className="mt-3 text-sm text-purple-700 dark:text-purple-300"
                      >
                        {timerMessage}
                      </p>
                    )}
                  </div>

                  {/* TOPICS */}
                  <div className="p-6">
                    <h3 className="mb-1 font-bold">Topics</h3>
                    <p className="mb-4 text-xs text-slate-400">
                      Mark topics complete separately from recording study time.
                    </p>

                    <form
                      onSubmit={handleAddTopic}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Add a topic..."
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-purple-400 dark:border-white/10 dark:bg-white/5"
                      />

                      <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
                      >
                        Add Topic
                      </button>
                    </form>

                    <div className="mt-6 space-y-2">
                      {!selectedSubject.topics?.length ? (
                        <p className="rounded-xl border border-dashed border-purple-200 p-8 text-center text-sm text-slate-400 dark:border-purple-500/20">
                          No topics yet. Add your first topic above.
                        </p>
                      ) : (
                        selectedSubject.topics.map((item) => (
                          <button
                            type="button"
                            key={item._id}
                            onClick={() => handleToggleTopic(item._id)}
                            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-300 hover:bg-purple-50/50 dark:border-white/10 dark:hover:bg-purple-500/5"
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                                item.completed
                                  ? "border-purple-600 bg-purple-600 text-white"
                                  : "border-slate-300 text-transparent dark:border-slate-600"
                              }`}
                            >
                              ✓
                            </span>

                            <span
                              className={`flex-1 text-sm font-medium ${
                                item.completed
                                  ? "text-slate-400 line-through"
                                  : ""
                              }`}
                            >
                              {item.title}
                            </span>

                            <span className="text-xs font-medium text-purple-500">
                              {item.completed ? "Completed" : "Mark done"}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default StudyWorkspace;