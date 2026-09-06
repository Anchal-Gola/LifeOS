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
      await addTopic(
        selectedSubject._id,
        topic.trim()
      );

      setTopic("");
      await fetchSubjects();
    } catch (error) {
      console.error("Add topic error:", error);
    }
  };

  const handleToggleTopic = async (topicId) => {
    if (!selectedSubject) return;

    try {
      await toggleTopic(
        selectedSubject._id,
        topicId
      );

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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-6 py-8">
        <div className="mx-auto max-w-6xl">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">
              Study Workspace
            </h1>

            <p className="mt-2 text-slate-500">
              Organize your subjects and track your study progress.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Add a subject
            </h2>

            <form
              onSubmit={handleCreateSubject}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
              />

              <button
                type="submit"
                disabled={loading || !subject.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add Subject
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Subjects
                </h2>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
                  {subjects.length}
                </span>
              </div>

              {subjects.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  No subjects yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {subjects.map((item) => (
                    <div
                      key={item._id}
                      className={`group flex items-center gap-2 rounded-xl transition ${
                        selectedSubject?._id === item._id
                          ? "bg-purple-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <button
                        onClick={() =>
                          handleSelectSubject(item)
                        }
                        className="min-w-0 flex-1 px-4 py-3 text-left"
                      >
                        <p className="truncate font-medium text-slate-800">
                          {item.subject}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {item.topics?.length || 0} topics
                        </p>
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteSubject(item._id)
                        }
                        className="mr-2 rounded-lg px-2 py-1.5 text-xs text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2">

              {!selectedSubject ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <div>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-2xl text-white">
                      📚
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900">
                      Select a subject
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Choose a subject to start managing your study topics.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        Current Subject
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {selectedSubject.subject}
                      </h2>
                    </div>

                    <div className="min-w-[150px]">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-500">
                          Progress
                        </span>

                        <span className="font-semibold text-slate-900">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleAddTopic}
                    className="mt-7 flex flex-col gap-3 sm:flex-row"
                  >
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) =>
                        setTopic(e.target.value)
                      }
                      placeholder="Add a topic..."
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50"
                    />

                    <button
                      type="submit"
                      disabled={!topic.trim()}
                      className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Add Topic
                    </button>
                  </form>

                  <div className="mt-7">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                      Topics
                    </h3>

                    {selectedSubject.topics?.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
                        <p className="text-sm text-slate-400">
                          No topics yet. Add your first topic.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedSubject.topics.map((item) => (
                          <button
                            key={item._id}
                            onClick={() =>
                              handleToggleTopic(item._id)
                            }
                            className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50/40"
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                                item.completed
                                  ? "border-purple-500 bg-purple-500 text-white"
                                  : "border-slate-300 text-transparent"
                              }`}
                            >
                              ✓
                            </span>

                            <span
                              className={`font-medium ${
                                item.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-700"
                              }`}
                            >
                              {item.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
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