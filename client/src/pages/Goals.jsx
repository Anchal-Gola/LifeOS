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
  return Math.min(
    100,
    Math.max(0, goal.progress ?? 0)
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-8">
        <div className="max-w-6xl mx-auto">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Goals
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Set meaningful goals and track your progress.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-5">
              Create a new goal
            </h2>

            <form
              onSubmit={handleCreateGoal}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">
                  No goals yet. Create your first goal.
                </p>
              </div>
            ) : (
              goals.map((goal) => {
                const completedToday = isCompletedToday(goal);
                const progress = calculateProgress(goal);

                if (editingId === goal._id) {
                  return (
                    <div
                      key={goal._id}
                      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                    >
                      <div className="space-y-4">
                        <input
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                        />

                        <textarea
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(e.target.value)
                          }
                          rows="3"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                        />

                        <input
                          type="date"
                          value={editDeadline}
                          onChange={(e) =>
                            setEditDeadline(e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                        />

                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleSaveEdit(goal._id)
                            }
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Save
                          </button>

                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white"
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
                    key={goal._id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {goal.title}
                        </h3>

                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                          {goal.description || "No description"}
                        </p>
                      </div>

                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          goal.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {goal.status}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500 dark:text-slate-400">
                          Progress
                        </span>

                        <span className="font-medium text-slate-900 dark:text-white">
                          {progress}%
                        </span>
                      </div>

                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {goal.deadline && (
                      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                        Deadline:{" "}
                        {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}

                    {goal.status !== "completed" && (
                      <button
                        onClick={() => handleCompleteToday(goal)}
                        disabled={completedToday}
                        className={`w-full mt-5 px-4 py-3 rounded-xl font-medium transition ${
                          completedToday
                            ? "bg-green-100 text-green-600 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {completedToday
                          ? "Today's Goal Completed ✓"
                          : "Complete Today"}
                      </button>
                    )}

                    <div className="flex gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleEditClick(goal)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteGoal(goal._id)}
                        className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default Goals;