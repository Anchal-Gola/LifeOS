import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../api/taskApi";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Todo");
  const [editingTask, setEditingTask] = useState(null);

  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.data);
    } catch (error) {
      console.error("Tasks error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setStatus("Todo");
    setEditingTask(null);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await createTask({
        title,
        description,
        priority,
        dueDate: dueDate || undefined,
      });

      resetForm();
      fetchTasks();
    } catch (error) {
      console.error("Create task error:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : ""
    );
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await updateTask(editingTask._id, {
        title,
        description,
        priority,
        status,
        dueDate: dueDate || undefined,
      });

      resetForm();
      fetchTasks();
    } catch (error) {
      console.error("Update task error:", error);
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      await updateTask(task._id, {
        status: "Completed",
      });

      fetchTasks();
    } catch (error) {
      console.error("Complete task error:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const activeTasks = tasks.length - completedTasks;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const todayTasks = useMemo(() => {
    const today = new Date();

    const todayString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      const dueDateString = new Date(task.dueDate).toLocaleDateString(
        "en-CA"
      );

      return dueDateString === todayString;
    });
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      let statusMatch = true;
      let priorityMatch = true;

      if (filter === "Active") {
        statusMatch = task.status !== "Completed";
      }

      if (filter === "Completed") {
        statusMatch = task.status === "Completed";
      }

      if (filter === "Today") {
        statusMatch = todayTasks.some(
          (todayTask) => todayTask._id === task._id
        );
      }

      if (priorityFilter !== "All") {
        priorityMatch = task.priority === priorityFilter;
      }

      return statusMatch && priorityMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Priority") {
        const priorityOrder = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      if (sortBy === "Due Date") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return new Date(a.dueDate) - new Date(b.dueDate);
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, filter, priorityFilter, todayTasks, sortBy]);

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (priority === "Low") {
      return "bg-green-50 text-green-600 border-green-100";
    }

    return "bg-yellow-50 text-yellow-600 border-yellow-100";
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "bg-purple-50 text-purple-600 border-purple-100";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-600 border-blue-100";
    }

    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-purple-600">
                Your productivity space
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Tasks
              </h1>

              <p className="mt-2 text-slate-500">
                Organize your work and stay focused on what matters.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Today
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {todayTasks.length} task
                {todayTasks.length !== 1 ? "s" : ""} due
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Tasks</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {tasks.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Active</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {activeTasks}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Completed</p>
              <p className="mt-2 text-2xl font-bold text-purple-600">
                {completedTasks}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Progress</p>
                <span className="text-sm font-semibold text-purple-600">
                  {completionPercentage}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

            {/* Form */}
            <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                  {editingTask ? "✏️" : "✨"}
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {editingTask ? "Edit Task" : "Create Task"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingTask
                    ? "Update your task details."
                    : "Add something you want to accomplish."}
                </p>
              </div>

              <form
                onSubmit={
                  editingTask ? handleUpdateTask : handleCreateTask
                }
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Task title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Complete DSA practice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    placeholder="Add some details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Priority
                    </label>

                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Due date
                    </label>

                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {editingTask && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:shadow-md"
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>

                {editingTask && (
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

            {/* Task List */}
            <div>
              {/* Filters */}
              <div className="mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex flex-wrap gap-2">
                    {["All", "Active", "Completed", "Today"].map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => setFilter(option)}
                          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            filter === option
                              ? "bg-purple-600 text-white shadow-sm"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={priorityFilter}
                      onChange={(e) =>
                        setPriorityFilter(e.target.value)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-purple-400"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-purple-400"
                    >
                      <option value="Newest">Newest</option>
                      <option value="Priority">Priority</option>
                      <option value="Due Date">Due Date</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {filter === "All" ? "All Tasks" : `${filter} Tasks`}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? "s" : ""} shown
                </p>
              </div>

              {filteredTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                    📝
                  </div>

                  <h3 className="font-semibold text-slate-900">
                    No matching tasks
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task._id}
                      className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                        task.status === "Completed"
                          ? "border-purple-100"
                          : "border-slate-100"
                      }`}
                    >
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleCompleteTask(task)}
                          disabled={task.status === "Completed"}
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            task.status === "Completed"
                              ? "border-purple-500 bg-purple-500 text-xs text-white"
                              : "border-slate-300 hover:border-purple-500"
                          }`}
                        >
                          {task.status === "Completed" && "✓"}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-3 sm:flex-row">
                            <div>
                              <h3
                                className={`font-semibold ${
                                  task.status === "Completed"
                                    ? "text-slate-400 line-through"
                                    : "text-slate-900"
                                }`}
                              >
                                {task.title}
                              </h3>

                              {task.description && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {task.description}
                                </p>
                              )}
                            </div>

                            <div className="flex shrink-0 gap-2">
                              <button
                                onClick={() => handleEditTask(task)}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteTask(task._id)
                                }
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority} Priority
                            </span>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>

                            {task.dueDate && (
                              <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                                📅{" "}
                                {new Date(
                                  task.dueDate
                                ).toLocaleDateString()}
                              </span>
                            )}
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

export default Tasks;