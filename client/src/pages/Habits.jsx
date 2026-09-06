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

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-indigo-600">
                Build better routines
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Habits
              </h1>

              <p className="mt-2 text-slate-500">
                Build consistency, one day at a time.
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Today
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {completedTodayCount} of {habits.length} completed
              </p>
            </div>
          </div>

          {/* Create Habit */}
          <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                ✨
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Create a new habit
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add a habit you want to practice consistently.
              </p>
            </div>

            <form
              onSubmit={handleCreateHabit}
              className="grid grid-cols-1 gap-4 md:grid-cols-4"
            >
              <input
                type="text"
                placeholder="Habit name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />

              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Add Habit
              </button>
            </form>
          </div>

          {/* Habits */}
          {habits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                🔄
              </div>

              <h3 className="font-semibold text-slate-900">
                No habits yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first habit above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {habits.map((habit) => {
                const completedToday = isCompletedToday(habit);
                const streak = getCurrentStreak(habit);

                if (editingId === habit._id) {
                  return (
                    <div
                      key={habit._id}
                      className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-5">
                        <h3 className="text-lg font-bold text-slate-900">
                          Edit Habit
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Update your habit details.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <input
                          value={editName}
                          onChange={(e) =>
                            setEditName(e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white"
                        />

                        <input
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white"
                        />

                        <select
                          value={editFrequency}
                          onChange={(e) =>
                            setEditFrequency(e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:bg-white"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleSaveEdit(habit._id)
                            }
                            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            Save
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={habit._id}
                    className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      completedToday
                        ? "border-green-100"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-slate-900">
                          {habit.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {habit.description || "No description"}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                            {habit.frequency}
                          </span>

                          <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                            🔥 {streak} day streak
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${
                          completedToday
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {completedToday ? "✓" : "○"}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            handleCompleteHabit(habit)
                          }
                          disabled={completedToday}
                          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                            completedToday
                              ? "cursor-not-allowed bg-green-100 text-green-600"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {completedToday
                            ? "Completed ✓"
                            : "Complete Today"}
                        </button>

                        <button
                          onClick={() => handleEditClick(habit)}
                          className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteHabit(habit._id)
                          }
                          className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Habits;