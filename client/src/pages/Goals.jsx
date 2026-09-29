import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  completeGoalToday,
} from "../api/goalApi";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  const fetchGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data.data);
    } catch (error) {
      console.error("Goals error:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createGoal({
        title,
        description,
        deadline: deadline || undefined,
      });

      setTitle("");
      setDescription("");
      setDeadline("");

      fetchGoals();
    } catch (error) {
      console.error("Create goal error:", error);
    }
  };

  const handleCompleteToday = async (goal) => {
    try {
      const today = new Date().toISOString();

      await completeGoalToday(goal._id, today);

      fetchGoals();
    } catch (error) {
      console.error("Complete goal error:", error);
    }
  };

  const isCompletedToday = (goal) => {
    const today = new Date().toDateString();

    return goal.completedDates?.some(
      (date) => new Date(date).toDateString() === today
    );
  };

  const calculateProgress = (goal) => {
    if (!goal.deadline || !goal.startDate) {
      return 0;
    }

    const start = new Date(goal.startDate);
    const deadlineDate = new Date(goal.deadline);

    const totalDays = Math.ceil(
      (deadlineDate - start) / (1000 * 60 * 60 * 24)
    );

    if (totalDays <= 0) return 100;

    const completedDays = goal.completedDates?.length || 0;

    return Math.min(
      100,
      Math.round((completedDays / totalDays) * 100)
    );
  };

  const handleEditClick = (goal) => {
    setEditingId(goal._id);
    setEditTitle(goal.title);
    setEditDescription(goal.description || "");
    setEditDeadline(
      goal.deadline ? goal.deadline.split("T")[0] : ""
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDeadline("");
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      await updateGoal(id, {
        title: editTitle,
        description: editDescription,
        deadline: editDeadline || undefined,
      });

      handleCancelEdit();
      fetchGoals();
    } catch (error) {
      console.error("Update goal error:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
      fetchGoals();
    } catch (error) {
      console.error("Delete goal error:", error);
    }
  };

  const activeGoals = goals.filter(
    (goal) => goal.status !== "completed"
  ).length;

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  const goalsCompletedToday = goals.filter((goal) =>
    isCompletedToday(goal)
  ).length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f7f7ff] px-5 py-8 text-[#172033] transition-colors duration-300 dark:bg-[#0b1120] dark:text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-violet-600 shadow-sm dark:border-violet-400/20 dark:bg-[#111827] dark:text-violet-300">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Goals
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Your Goals
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Turn long-term plans into meaningful daily progress.
              </p>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 text-center shadow-sm dark:border-violet-400/15 dark:bg-[#111827]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Total
                </p>
                <p className="mt-1 text-lg font-black text-violet-600 dark:text-violet-300">
                  {goals.length}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-center shadow-sm dark:border-blue-400/15 dark:bg-[#111827]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Active
                </p>
                <p className="mt-1 text-lg font-black text-blue-600 dark:text-blue-300">
                  {activeGoals}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-center shadow-sm dark:border-emerald-400/15 dark:bg-[#111827]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Today
                </p>
                <p className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-300">
                  {goalsCompletedToday}
                </p>
              </div>
            </div>
          </div>

          {/* Create Goal */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm dark:border-violet-400/15 dark:bg-[#111827]">
            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-pink-50 px-6 py-6 dark:border-violet-400/10 dark:from-violet-950/30 dark:via-[#111827] dark:to-fuchsia-950/20">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl text-white shadow-lg shadow-violet-500/20">
                  🎯
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-500 dark:text-violet-300">
                    New Goal
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Create a goal
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleCreateGoal}
                className="grid gap-4 lg:grid-cols-2"
              >
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Goal title
                  </label>

                  <input
                    type="text"
                    placeholder="What do you want to achieve?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-900 dark:focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Description
                  </label>

                  <textarea
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-900 dark:focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Deadline
                  </label>

                  <div className="flex h-[calc(100%-28px)] flex-col gap-4">
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-900 dark:focus:ring-violet-500/10"
                    />

                    <button
                      type="submit"
                      className="mt-auto w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-violet-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/25"
                    >
                      Create Goal
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Section heading */}
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-500 dark:text-violet-300">
                Goal Workspace
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Your Goals
              </h2>
            </div>

            <p className="text-sm font-semibold text-slate-400">
              {goals.length} goal
              {goals.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Goal cards */}
          {goals.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-[#111827]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-pink-50 text-2xl dark:from-violet-950/40 dark:to-fuchsia-950/30">
                🎯
              </div>

              <h3 className="mt-5 text-lg font-black">
                No goals yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create your first goal and start turning your plans into
                progress.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => {
                const completedToday = isCompletedToday(goal);
                const progress = calculateProgress(goal);
                const isCompleted = goal.status === "completed";

                if (editingId === goal._id) {
                  return (
                    <article
                      key={goal._id}
                      className="rounded-3xl border border-violet-200 bg-white p-6 shadow-sm dark:border-violet-400/20 dark:bg-[#111827]"
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-lg dark:bg-violet-500/10">
                          ✎
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-500 dark:text-violet-300">
                            Editing
                          </p>

                          <h3 className="font-black">
                            Update Goal
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <input
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-900"
                        />

                        <textarea
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(e.target.value)
                          }
                          rows="4"
                          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500 dark:focus:bg-slate-900"
                        />

                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) =>
                            setEditDeadline(e.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none focus:border-violet-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-violet-500"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() =>
                              handleSaveEdit(goal._id)
                            }
                            className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-extrabold text-white shadow-md"
                          >
                            Save Changes
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }

                return (
                  <article
                    key={goal._id}
                    className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-[#111827] dark:hover:border-violet-400/20"
                  >
                    {/* Accent */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        isCompleted
                          ? "bg-gradient-to-b from-emerald-500 to-teal-400"
                          : "bg-gradient-to-b from-violet-500 to-fuchsia-500"
                      }`}
                    />

                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-400/10 blur-[65px] transition group-hover:bg-fuchsia-400/15" />

                    <div className="relative">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 text-lg dark:from-violet-500/15 dark:to-fuchsia-500/10">
                            🎯
                          </div>

                          <h3
                            className={`text-xl font-black tracking-tight ${
                              isCompleted
                                ? "text-slate-400 line-through"
                                : ""
                            }`}
                          >
                            {goal.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {goal.description || "No description"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${
                            isCompleted
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                              : "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300"
                          }`}
                        >
                          {goal.status}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mt-7">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Progress
                          </span>

                          <span className="text-sm font-black text-violet-600 dark:text-violet-300">
                            {progress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                : "bg-gradient-to-r from-violet-600 to-fuchsia-500"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Deadline */}
                      {goal.deadline && (
                        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Deadline
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                            {new Date(
                              goal.deadline
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}

                      {/* Complete today */}
                      {!isCompleted && (
                        <button
                          onClick={() =>
                            handleCompleteToday(goal)
                          }
                          disabled={completedToday}
                          className={`mt-5 w-full rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                            completedToday
                              ? "cursor-not-allowed bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
                              : "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/15 hover:-translate-y-0.5 hover:shadow-lg"
                          }`}
                        >
                          {completedToday
                            ? "Today's Progress Completed ✓"
                            : "Complete Today"}
                        </button>
                      )}

                      {/* Actions */}
                      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                        <button
                          onClick={() => handleEditClick(goal)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-violet-400/20 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteGoal(goal._id)
                          }
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-400/20 dark:hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom summary */}
          {goals.length > 0 && (
            <div className="mt-8 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-pink-50 px-6 py-5 dark:border-violet-400/15 dark:from-violet-950/20 dark:via-[#111827] dark:to-fuchsia-950/15">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-violet-700 dark:text-violet-300">
                    Keep moving forward.
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {completedGoals} completed · {activeGoals} active
                  </p>
                </div>

                <p className="text-xs font-semibold text-slate-400">
                  Small progress adds up.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default Goals;