import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createStudy,
  getStudies,
  updateStudy,
  deleteStudy,
} from "../api/studyApi";

function Study() {
  const [studies, setStudies] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [editingStudy, setEditingStudy] = useState(null);

  const fetchStudies = async () => {
    try {
      const data = await getStudies();
      setStudies(data.data);
    } catch (error) {
      console.error("Studies error:", error);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const resetForm = () => {
    setSubject("");
    setTopic("");
    setDuration("");
    setDate("");
    setNotes("");
    setEditingStudy(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) return;

    try {
      const studyData = {
        subject,
        topic,
        duration: Number(duration) || 0,
        date: date || undefined,
        notes,
      };

      if (editingStudy) {
        await updateStudy(editingStudy._id, studyData);
      } else {
        await createStudy(studyData);
      }

      resetForm();
      fetchStudies();
    } catch (error) {
      console.error("Study save error:", error);
    }
  };

  const handleEdit = (study) => {
    setEditingStudy(study);
    setSubject(study.subject || "");
    setTopic(study.topic || "");
    setDuration(study.duration || "");
    setNotes(study.notes || "");

    setDate(
      study.date
        ? new Date(study.date).toISOString().split("T")[0]
        : ""
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudy(id);
      fetchStudies();
    } catch (error) {
      console.error("Delete study error:", error);
    }
  };

  const totalMinutes = useMemo(() => {
    return studies.reduce(
      (total, study) => total + (Number(study.duration) || 0),
      0
    );
  }, [studies]);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const todayStudies = useMemo(() => {
    const today = new Date();

    return studies.filter((study) => {
      if (!study.date) return false;

      const studyDate = new Date(study.date);

      return (
        studyDate.getFullYear() === today.getFullYear() &&
        studyDate.getMonth() === today.getMonth() &&
        studyDate.getDate() === today.getDate()
      );
    });
  }, [studies]);

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Your learning space
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Study Workspace
              </h1>

              <p className="mt-2 text-slate-500">
                Track your study sessions and keep your learning organized.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Today
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {todayStudies.length} session
                {todayStudies.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Study Sessions</p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {studies.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Study Time</p>

              <p className="mt-2 text-2xl font-bold text-purple-600">
                {totalHours}h {remainingMinutes}m
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Today's Sessions</p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {todayStudies.length}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  {editingStudy ? "✏️" : "📚"}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingStudy ? "Edit Study Session" : "Add Study Session"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingStudy
                    ? "Update your study session."
                    : "Record what you studied today."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Data Structures"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Topic
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Binary Trees"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Duration
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="Minutes"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
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
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Notes
                  </label>

                  <textarea
                    placeholder="What did you learn?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="4"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                >
                  {editingStudy ? "Update Session" : "Add Study Session"}
                </button>

                {editingStudy && (
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

            {/* Study List */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Study Sessions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {studies.length} session
                  {studies.length !== 1 ? "s" : ""} recorded
                </p>
              </div>

              {studies.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                    📚
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No study sessions yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your first study session to start tracking your progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studies.map((study) => (
                    <div
                      key={study._id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900">
                            {study.subject}
                          </h3>

                          {study.topic && (
                            <p className="mt-1 text-sm text-purple-600">
                              {study.topic}
                            </p>
                          )}

                          {study.notes && (
                            <p className="mt-2 text-sm text-slate-500">
                              {study.notes}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                              ⏱ {study.duration || 0} min
                            </span>

                            <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                              📅{" "}
                              {study.date
                                ? new Date(
                                    study.date
                                  ).toLocaleDateString()
                                : "No date"}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => handleEdit(study)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(study._id)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
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

export default Study;