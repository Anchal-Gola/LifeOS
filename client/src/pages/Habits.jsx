import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createHabit,
  getHabits,
  updateHabit,
  completeHabit,
  deleteHabit,
} from "../api/habitApi";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFrequency, setEditFrequency] = useState("daily");

  const fetchHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data.data);
    } catch (error) {
      console.error("Habits error:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await createHabit({
        name,
        description,
        frequency,
      });

      setName("");
      setDescription("");
      setFrequency("daily");

      fetchHabits();
    } catch (error) {
      console.error("Create habit error:", error);
    }
  };

  const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getTodayString = () => {
    return getDateKey(new Date());
  };

  const getCompletedDateKeys = (habit) => {
    if (!habit.completedDates?.length) {
      return [];
    }

    return [
      ...new Set(
        habit.completedDates.map((date) => getDateKey(date))
      ),
    ];
  };

  const isCompletedToday = (habit) => {
    const today = getTodayString();

    return getCompletedDateKeys(habit).includes(today);
  };

  const handleCompleteHabit = async (habit) => {
    if (isCompletedToday(habit)) return;

    try {
      await completeHabit(
        habit._id,
        new Date().toISOString()
      );

      fetchHabits();
    } catch (error) {
      console.error("Complete habit error:", error);
    }
  };

  const handleDeleteHabit = async (id) => {
    try {
      await deleteHabit(id);
      fetchHabits();
    } catch (error) {
      console.error("Delete habit error:", error);
    }
  };

  const handleEditClick = (habit) => {
    setEditingId(habit._id);
    setEditName(habit.name);
    setEditDescription(habit.description || "");
    setEditFrequency(habit.frequency);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditFrequency("daily");
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return;

    try {
      await updateHabit(id, {
        name: editName,
        description: editDescription,
        frequency: editFrequency,
      });

      handleCancelEdit();
      fetchHabits();
    } catch (error) {
      console.error("Update habit error:", error);
    }
  };

  const getCurrentStreak = (habit) => {
    if (!habit.completedDates?.length) return 0;

    const uniqueDates = [
      ...new Set(
        habit.completedDates.map((date) => getDateKey(date))
      ),
    ];

    const dates = uniqueDates
      .map((date) => new Date(`${date}T00:00:00`))
      .sort((a, b) => b - a);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Current streak only exists if today is completed.
    if (dates[0].getTime() !== today.getTime()) {
      return 0;
    }

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
      const difference =
        (dates[i] - dates[i + 1]) /
        (1000 * 60 * 60 * 24);

      // Continue only when the previous calendar day
      // was also completed.
      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const completedTodayCount = useMemo(() => {
    return habits.filter((habit) =>
      isCompletedToday(habit)
    ).length;
  }, [habits]);

  const activeHabits = habits.filter(
    (habit) => !isCompletedToday(habit)
  ).length;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 px-5 py-8 text-[#172033] transition-colors duration-300 dark:from-[#0a1020] dark:via-[#0d1426] dark:to-indigo-950/20 dark:text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Habits
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Your Habits
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                Build consistency through small actions repeated every day.
              </p>
            </div>

            {/* Today Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-3 shadow-sm dark:border-indigo-900/60 dark:bg-[#111827]">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Completed Today
                </p>

                <p className="mt-1 text-lg font-black text-indigo-600 dark:text-indigo-300">
                  {completedTodayCount}
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white px-5 py-3 shadow-sm dark:border-blue-900/60 dark:bg-[#111827]">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Remaining
                </p>

                <p className="mt-1 text-lg font-black text-blue-600 dark:text-blue-300">
                  {activeHabits}
                </p>
              </div>
            </div>
          </div>

          {/* Create Habit */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm dark:border-slate-800 dark:bg-[#111827]">

            <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-6 dark:border-slate-800 dark:from-indigo-950/30 dark:via-[#111827] dark:to-violet-950/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xl text-white shadow-lg shadow-indigo-500/20">
                  +
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-500 dark:text-indigo-300">
                    New Routine
                  </p>

                  <h2 className="mt-1 text-xl font-black">
                    Create a habit
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form
                onSubmit={handleCreateHabit}
                className="grid gap-4 lg:grid-cols-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Habit name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Exercise"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Description
                  </label>

                  <input
                    type="text"
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Frequency
                  </label>

                  <select
                    value={frequency}
                    onChange={(e) =>
                      setFrequency(e.target.value)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-500/10"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25"
                  >
                    Add Habit
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Workspace Heading */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">
              Routine Workspace
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight">
              Your Habits
            </h2>
          </div>

          {/* Empty State */}
          {habits.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-[#111827]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-2xl dark:from-indigo-950/40 dark:to-violet-950/30">
                ✦
              </div>

              <h3 className="mt-5 text-lg font-black">
                No habits yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                Create your first habit and start building a consistent routine.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {habits.map((habit) => {
                const completedToday = isCompletedToday(habit);
                const streak = getCurrentStreak(habit);

                if (editingId === habit._id) {
                  return (
                    <article
                      key={habit._id}
                      className="rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm dark:border-indigo-400/20 dark:bg-[#111827]"
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                          ✎
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-indigo-500 dark:text-indigo-300">
                            Editing
                          </p>

                          <h3 className="font-black">
                            Update Habit
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <input
                          value={editName}
                          onChange={(e) =>
                            setEditName(e.target.value)
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
                        />

                        <input
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
                        />

                        <select
                          value={editFrequency}
                          onChange={(e) =>
                            setEditFrequency(
                              e.target.value
                            )
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500"
                        >
                          <option value="daily">
                            Daily
                          </option>

                          <option value="weekly">
                            Weekly
                          </option>
                        </select>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() =>
                              handleSaveEdit(habit._id)
                            }
                            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-extrabold text-white"
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
                    key={habit._id}
                    className={`group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#111827] ${
                      completedToday
                        ? "border-indigo-100 dark:border-indigo-400/20"
                        : "border-slate-100 dark:border-slate-800"
                    }`}
                  >
                    {/* Accent */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        completedToday
                          ? "bg-gradient-to-b from-indigo-600 to-violet-500"
                          : "bg-gradient-to-b from-blue-500 to-indigo-500"
                      }`}
                    />

                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-[65px] transition group-hover:bg-violet-500/15" />

                    <div className="relative">

                      {/* Top */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-lg text-indigo-600 dark:from-indigo-950/50 dark:to-violet-950/40 dark:text-indigo-300">
                            ✦
                          </div>

                          <h3 className="text-xl font-black tracking-tight">
                            {habit.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {habit.description || "No description"}
                          </p>
                        </div>

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                            completedToday
                              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          }`}
                        >
                          {completedToday ? "✓" : "○"}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold capitalize text-indigo-600 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-300">
                          {habit.frequency}
                        </span>

                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                          🔥 {streak} day streak
                        </span>
                      </div>

                      {/* Status */}
                      <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                              Today's status
                            </p>

                            <p
                              className={`mt-1 text-sm font-black ${
                                completedToday
                                  ? "text-indigo-600 dark:text-indigo-300"
                                  : "text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {completedToday
                                ? "Completed"
                                : "Not completed yet"}
                            </p>
                          </div>

                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              completedToday
                                ? "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.7)]"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
                        <button
                          onClick={() =>
                            handleCompleteHabit(habit)
                          }
                          disabled={completedToday}
                          className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                            completedToday
                              ? "cursor-not-allowed bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
                              : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/15 hover:-translate-y-0.5 hover:shadow-lg"
                          }`}
                        >
                          {completedToday
                            ? "Completed ✓"
                            : "Complete Today"}
                        </button>

                        <button
                          onClick={() =>
                            handleEditClick(habit)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/20 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteHabit(habit._id)
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-500 transition hover:border-rose-200 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-400/20 dark:hover:bg-rose-500/10"
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

          {/* Bottom Summary */}
          {habits.length > 0 && (
            <div className="mt-8 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 px-6 py-5 dark:border-indigo-400/15 dark:from-indigo-950/20 dark:via-[#111827] dark:to-violet-950/15">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-indigo-700 dark:text-indigo-300">
                    Keep the routine going.
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {completedTodayCount} completed today ·{" "}
                    {activeHabits} remaining
                  </p>
                </div>

                <p className="text-xs font-semibold text-slate-400">
                  Consistency beats intensity.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}

export default Habits;