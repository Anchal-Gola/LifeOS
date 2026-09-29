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
    setDescription(task.description || "");
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

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High" && task.status !== "Completed"
  ).length;

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
      return {
        badge:
          "border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300",
        dot: "bg-pink-500",
      };
    }

    if (priority === "Low") {
      return {
        badge:
          "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300",
        dot: "bg-purple-500",
      };
    }

    return {
      badge:
        "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
      dot: "bg-fuchsia-500",
    };
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300";
    }

    if (status === "In Progress") {
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300";
    }

    return "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300";
  };

  const isOverdue = (date) => {
    if (!date) return false;

    const today = new Date();
    const due = new Date(date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  return (
    <MainLayout>
      <div className="relative min-h-full overflow-hidden bg-[#f8f7ff] px-5 py-8 text-slate-900 transition-colors dark:bg-[#100d18] dark:text-white sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-pink-300/15 blur-3xl dark:bg-pink-600/10" />

        <div className="relative mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 overflow-hidden rounded-[30px] border border-purple-100 bg-white/90 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl dark:border-purple-500/15 dark:bg-[#17121f]/90">
            <div className="h-1 bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500" />

            <div className="flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-purple-600 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300">
                  <span className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  Productivity
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Your Tasks
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  Plan your work, stay focused, and keep moving forward.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/80 px-5 py-3 dark:border-purple-500/15 dark:bg-purple-500/[0.08]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Due Today
                  </p>
                  <p className="mt-1 text-lg font-black text-purple-600 dark:text-purple-300">
                    {todayTasks.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-pink-100 bg-pink-50/80 px-5 py-3 dark:border-pink-500/15 dark:bg-pink-500/[0.08]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Progress
                  </p>
                  <p className="mt-1 text-lg font-black text-pink-600 dark:text-pink-300">
                    {completionPercentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total Tasks",
                value: tasks.length,
                icon: "✓",
                color:
                  "from-violet-600 to-purple-500",
                glow: "bg-purple-400/10",
              },
              {
                label: "Active",
                value: activeTasks,
                icon: "◌",
                color:
                  "from-purple-600 to-fuchsia-500",
                glow: "bg-fuchsia-400/10",
              },
              {
                label: "Completed",
                value: completedTasks,
                icon: "✓",
                color:
                  "from-violet-600 to-pink-500",
                glow: "bg-violet-400/10",
              },
              {
                label: "High Priority",
                value: highPriorityTasks,
                icon: "!",
                color:
                  "from-fuchsia-600 to-pink-500",
                glow: "bg-pink-400/10",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-5 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]"
              >
                <div
                  className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${stat.glow} blur-2xl`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-lg text-white shadow-lg`}
                    >
                      {stat.icon}
                    </div>
                  </div>

                  <p className="mt-4 text-3xl font-black text-slate-900 dark:text-white">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {stat.label === "Total Tasks"
                      ? "Across your workspace"
                      : stat.label === "Active"
                      ? "Tasks still in progress"
                      : stat.label === "Completed"
                      ? "Finished tasks"
                      : "Needs your attention"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Main workspace */}
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">

            {/* Create / Edit */}
            <div className="h-fit overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm dark:border-white/[0.07] dark:bg-[#17121f]">
              <div className="border-b border-purple-100 bg-gradient-to-r from-purple-50 via-white to-pink-50 px-6 py-6 dark:border-purple-500/10 dark:from-purple-500/[0.08] dark:via-transparent dark:to-pink-500/[0.06]">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-lg ${
                      editingTask
                        ? "from-violet-600 to-pink-500 shadow-pink-500/20"
                        : "from-purple-600 to-fuchsia-500 shadow-purple-500/20"
                    }`}
                  >
                    {editingTask ? "✎" : "+"}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      {editingTask ? "Update" : "New Task"}
                    </p>

                    <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                      {editingTask ? "Edit Task" : "Create a Task"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form
                  onSubmit={
                    editingTask ? handleUpdateTask : handleCreateTask
                  }
                  className="space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Task title
                    </label>

                    <input
                      type="text"
                      placeholder="What do you need to accomplish?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-white/[0.06] dark:focus:ring-purple-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                      Description
                    </label>

                    <textarea
                      placeholder="Add useful details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="4"
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-purple-500 dark:focus:bg-white/[0.06] dark:focus:ring-purple-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Priority
                      </label>

                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-[#211a2b] dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Due date
                      </label>

                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
                      />
                    </div>
                  </div>

                  {editingTask && (
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
                        Status
                      </label>

                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-[#211a2b] dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-purple-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/20"
                  >
                    {editingTask ? "Save Changes" : "Add Task"}
                  </button>

                  {editingTask && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Right side */}
            <div className="min-w-0">

              {/* Filters */}
              <div className="mb-6 rounded-3xl border border-purple-100 bg-white p-4 shadow-sm dark:border-white/[0.07] dark:bg-[#17121f] sm:p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {["All", "Active", "Completed", "Today"].map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => setFilter(option)}
                          className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                            filter === option
                              ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md shadow-purple-500/20"
                              : "bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-600 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
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
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-[#211a2b] dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100 dark:border-white/10 dark:bg-[#211a2b] dark:text-slate-200 dark:focus:border-purple-500 dark:focus:ring-purple-500/10"
                    >
                      <option value="Newest">Newest</option>
                      <option value="Priority">Priority</option>
                      <option value="Due Date">Due Date</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* List heading */}
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-500 dark:text-purple-400">
                    Task Workspace
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {filter === "All" ? "All Tasks" : `${filter} Tasks`}
                  </h2>
                </div>

                <p className="text-sm font-semibold text-slate-400">
                  {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? "s" : ""} shown
                </p>
              </div>

              {/* Empty state */}
              {filteredTasks.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-purple-200 bg-white px-6 py-20 text-center shadow-sm dark:border-purple-500/20 dark:bg-[#17121f]">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 text-2xl dark:from-purple-500/10 dark:to-pink-500/10">
                    ✨
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                    No tasks here
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {tasks.length === 0
                      ? "Create your first task and start building momentum."
                      : "Try another filter or create a new task."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => {
                    const priorityStyle = getPriorityStyle(task.priority);

                    const overdue =
                      task.status !== "Completed" &&
                      isOverdue(task.dueDate);

                    return (
                      <article
                        key={task._id}
                        className={`group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-[#17121f] sm:p-6 ${
                          task.status === "Completed"
                            ? "border-purple-100 dark:border-purple-500/15"
                            : overdue
                            ? "border-pink-100 dark:border-pink-500/15"
                            : "border-slate-100 dark:border-white/[0.07]"
                        }`}
                      >
                        <div
                          className={`absolute left-0 top-0 h-full w-1 ${
                            task.status === "Completed"
                              ? "bg-gradient-to-b from-violet-600 to-pink-500"
                              : task.priority === "High"
                              ? "bg-gradient-to-b from-pink-500 to-fuchsia-500"
                              : task.priority === "Low"
                              ? "bg-gradient-to-b from-purple-500 to-violet-500"
                              : "bg-gradient-to-b from-violet-500 to-fuchsia-500"
                          }`}
                        />

                        <div className="flex gap-4">
                          <button
                            onClick={() => handleCompleteTask(task)}
                            disabled={task.status === "Completed"}
                            aria-label="Complete task"
                            className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                              task.status === "Completed"
                                ? "border-purple-500 bg-purple-500 text-sm font-black text-white"
                                : "border-slate-300 text-transparent hover:border-purple-500 hover:bg-purple-50 dark:border-slate-600 dark:hover:border-purple-400 dark:hover:bg-purple-500/10"
                            }`}
                          >
                            ✓
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div className="min-w-0">
                                <h3
                                  className={`text-base font-black sm:text-lg ${
                                    task.status === "Completed"
                                      ? "text-slate-400 line-through"
                                      : "text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {task.title}
                                </h3>

                                {task.description && (
                                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                    {task.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="rounded-xl border border-purple-100 bg-white px-3.5 py-2 text-xs font-bold text-purple-600 transition hover:bg-purple-50 dark:border-purple-500/15 dark:bg-white/[0.03] dark:text-purple-300 dark:hover:bg-purple-500/10"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => handleDeleteTask(task._id)}
                                  className="rounded-xl border border-pink-100 bg-white px-3.5 py-2 text-xs font-bold text-pink-500 transition hover:bg-pink-50 dark:border-pink-500/15 dark:bg-white/[0.03] dark:text-pink-300 dark:hover:bg-pink-500/10"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2.5">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${priorityStyle.badge}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${priorityStyle.dot}`}
                                />
                                {task.priority} Priority
                              </span>

                              <span
                                className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                                  task.status
                                )}`}
                              >
                                {task.status}
                              </span>

                              {task.dueDate && (
                                <span
                                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                                    overdue
                                      ? "border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300"
                                      : "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400"
                                  }`}
                                >
                                  {overdue ? "⚠ " : "◷ "}
                                  {new Date(
                                    task.dueDate
                                  ).toLocaleDateString()}
                                  {overdue ? " • Overdue" : ""}
                                </span>
                              )}
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                              <p className="text-xs font-semibold text-slate-400">
                                Created{" "}
                                {new Date(
                                  task.createdAt
                                ).toLocaleDateString()}
                              </p>

                              {task.status !== "Completed" && (
                                <button
                                  onClick={() => handleCompleteTask(task)}
                                  className="text-xs font-extrabold text-purple-600 transition hover:text-pink-500 dark:text-purple-400 dark:hover:text-pink-400"
                                >
                                  Mark complete →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
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