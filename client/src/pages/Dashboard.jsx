import { useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getDashboard } from "../services/dashboardService";
import axios from "axios";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [intelligence, setIntelligence] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [intelligenceLoading, setIntelligenceLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchIntelligence = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/intelligence",
          {
            withCredentials: true,
          }
        );

        setIntelligence(response.data.data);
      } catch (error) {
        console.error("Intelligence error:", error);
      } finally {
        setIntelligenceLoading(false);
      }
    };

    fetchIntelligence();
  }, []);

  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayTasks = dashboard?.tasks || [];

  const completedToday = useMemo(
    () =>
      todayTasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
      ).length,
    [todayTasks]
  );

  const progress =
    todayTasks.length > 0
      ? Math.round((completedToday / todayTasks.length) * 100)
      : 0;

  const getInsightIcon = (type) => {
    const icons = {
      productivity: "📊",
      warning: "⚠️",
      positive: "📈",
      study: "📚",
      habit: "🔁",
      goal: "🎯",
      journal: "📔",
      info: "💡",
    };

    return icons[type] || "💡";
  };

  const stats = dashboard
    ? [
        {
          title: "Tasks",
          value: dashboard.summary.totalTasks,
          subtitle: "planned",
          icon: "✓",
          iconBg: "bg-blue-50 text-blue-600",
          darkIconBg: "dark:bg-blue-500/10 dark:text-blue-400",
          accent: "bg-blue-500",
        },
        {
          title: "Habits",
          value: dashboard.summary.totalHabits,
          subtitle: "active",
          icon: "↗",
          iconBg: "bg-emerald-50 text-emerald-600",
          darkIconBg: "dark:bg-emerald-500/10 dark:text-emerald-400",
          accent: "bg-emerald-500",
        },
        {
          title: "Goals",
          value: dashboard.summary.totalGoals,
          subtitle: "in progress",
          icon: "◆",
          iconBg: "bg-violet-50 text-violet-600",
          darkIconBg: "dark:bg-violet-500/10 dark:text-violet-400",
          accent: "bg-violet-500",
        },
        {
          title: "Study",
          value: dashboard.summary.totalStudyMinutes,
          subtitle: "minutes",
          icon: "◈",
          iconBg: "bg-cyan-50 text-cyan-600",
          darkIconBg: "dark:bg-cyan-500/10 dark:text-cyan-400",
          accent: "bg-cyan-500",
        },
      ]
    : [];

  return (
    <MainLayout>
      <div className="min-h-full bg-[#f8f8fc] px-4 py-6 transition-colors dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* TOP HEADER */}
          <section className="relative mb-7 overflow-hidden rounded-[2rem] border border-purple-100 bg-white px-6 py-7 shadow-[0_12px_45px_rgba(124,58,237,0.07)] dark:border-slate-800 dark:bg-slate-900 sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-purple-100/70 blur-3xl dark:bg-purple-900/10" />
            <div className="pointer-events-none absolute -bottom-28 right-1/3 h-60 w-60 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/10" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600 dark:border-purple-900/40 dark:bg-purple-500/10 dark:text-purple-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    Personal Dashboard
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    {formattedDate}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-[#172033] dark:text-white sm:text-4xl lg:text-[2.7rem]">
                  {greeting},{" "}
                  <span className="text-purple-600 dark:text-purple-400">
                    Anchal
                  </span>{" "}
                  👋
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
                  Your personal space to organize, focus and move forward.
                </p>
              </div>

              {/* Progress card */}
              <div className="relative w-full max-w-sm rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Today's progress
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#172033] dark:text-white">
                      {completedToday} of {todayTasks.length} tasks completed
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-purple-100 bg-white text-xs font-extrabold text-purple-600 dark:border-purple-900/40 dark:bg-slate-900 dark:text-purple-400">
                    {progress}%
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* OVERVIEW */}
          <section className="mb-7">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-400">
                Overview
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#172033] dark:text-white">
                Your life at a glance
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dashboardLoading ? (
                [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-2xl bg-white dark:bg-slate-900"
                  />
                ))
              ) : dashboard ? (
                stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_5px_25px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div
                      className={`absolute left-0 top-0 h-1 w-full ${stat.accent}`}
                    />

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                          {stat.title}
                        </p>

                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-[#172033] dark:text-white">
                            {stat.value}
                          </span>

                          <span className="text-xs text-slate-400">
                            {stat.subtitle}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${stat.iconBg} ${stat.darkIconBg}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                  Unable to load dashboard data.
                </div>
              )}
            </div>
          </section>

          {/* MAIN CONTENT */}
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">

            {/* TODAY'S FOCUS */}
            <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-[0_8px_35px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-7">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
                    Focus
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#172033] dark:text-white">
                    Today's priorities
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Stay focused on what matters.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  ⚡
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {dashboardLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-20 animate-pulse rounded-2xl bg-slate-50 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                ) : !dashboard ? (
                  <p className="text-sm text-red-500">
                    Unable to load today's tasks.
                  </p>
                ) : todayTasks.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/40">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-xl text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      ✓
                    </div>

                    <h3 className="mt-4 font-bold text-slate-800 dark:text-white">
                      You're all clear
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      No tasks are demanding your attention today.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayTasks.map((task, index) => {
                      const completed =
                        task.status?.toLowerCase() === "completed";

                      return (
                        <div
                          key={task._id}
                          className={`group flex items-center gap-4 rounded-2xl border p-4 transition ${
                            completed
                              ? "border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-500/5"
                              : "border-slate-100 bg-white hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900/50"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                              completed
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            }`}
                          >
                            {completed
                              ? "✓"
                              : String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3
                              className={`truncate text-sm font-bold ${
                                completed
                                  ? "text-slate-400 line-through"
                                  : "text-[#172033] dark:text-white"
                              }`}
                            >
                              {task.title}
                            </h3>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              {task.description || "No description"}
                            </p>
                          </div>

                          <span
                            className={`hidden rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide sm:block ${
                              completed
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* INTELLIGENCE */}
            <section className="overflow-hidden rounded-[1.75rem] border border-purple-100 bg-white shadow-[0_8px_35px_rgba(124,58,237,0.06)] dark:border-purple-900/40 dark:bg-slate-900">
              <div className="border-b border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 px-6 py-6 dark:border-purple-900/40 dark:from-purple-950/30 dark:via-slate-900 dark:to-pink-950/20 sm:px-7">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-lg dark:bg-purple-500/10">
                    🧠
                  </div>

                  <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:border-emerald-900/40 dark:bg-slate-900 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    AI Active
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#172033] dark:text-white">
                  LifeOS Intelligence
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Personalized signals from your activity.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                {intelligenceLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((item) => (
                      <div
                        key={item}
                        className="h-24 animate-pulse rounded-2xl bg-slate-50 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                ) : !intelligence ? (
                  <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-5 dark:border-purple-900/50 dark:bg-purple-500/5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      Insights unavailable
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      We couldn't load your insights right now.
                    </p>
                  </div>
                ) : intelligence.insights.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-5 dark:border-purple-900/50 dark:bg-purple-500/5">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      No insights yet
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Keep using LifeOS and personalized insights will appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {intelligence.insights.slice(0, 3).map((insight, index) => (
                      <div
                        key={`${insight.type}-${index}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:border-purple-100 hover:bg-purple-50/30 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-purple-900/50"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-sm dark:bg-slate-900">
                            {getInsightIcon(insight.type)}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#172033] dark:text-white">
                              {insight.title}
                            </h3>

                            <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              {insight.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* FOOTER METRICS */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Today's focus
              </p>

              <p className="mt-2 text-lg font-bold text-[#172033] dark:text-white">
                {progress}% complete
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Keep building momentum.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Active areas
              </p>

              <p className="mt-2 text-lg font-bold text-[#172033] dark:text-white">
                {dashboard?.summary
                  ? dashboard.summary.totalTasks +
                    dashboard.summary.totalHabits +
                    dashboard.summary.totalGoals
                  : "—"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Tasks, habits and goals combined.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                LifeOS status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-lg font-bold text-[#172033] dark:text-white">
                  Everything active
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Your personal workspace is ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;