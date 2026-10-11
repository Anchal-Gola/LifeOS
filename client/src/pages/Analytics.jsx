
import { useCallback, useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getAnalytics } from "../services/analyticsService";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");

    try {
      const response = await getAnalytics();
      setAnalytics(response?.data ?? response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load analytics. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const data = analytics ?? {};
  const weeklyData = data.weeklyData ?? [];

  const totalTasks = Number(data.totalTasks) || 0;
  const completedTasks = Number(data.completedTasks) || 0;
  const pendingTasks = Number(data.pendingTasks) || 0;
  const totalHabits = Number(data.totalHabits) || 0;
  const totalGoals = Number(data.totalGoals) || 0;
  const completedGoals = Number(data.completedGoals) || 0;
  const studyMinutes = Number(data.totalStudyMinutes) || 0;
  const goalProgress = Math.min(
    100,
    Math.max(0, Number(data.averageGoalProgress) || 0)
  );

  const taskProgress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const maxTasks = Math.max(
    1,
    ...weeklyData.map((day) => Number(day.tasksCreated) || 0)
  );

  const maxStudy = Math.max(
    1,
    ...weeklyData.map((day) => Number(day.studyMinutes) || 0)
  );

  const totalWeeklyStudy = weeklyData.reduce(
    (sum, day) => sum + (Number(day.studyMinutes) || 0),
    0
  );

  const formatStudyTime = (minutes) =>
    `${Math.floor(minutes / 60)} hr : ${minutes % 60} min`;

  const cards = [
    {
      label: "Total Tasks",
      value: totalTasks,
      detail: `${completedTasks} completed`,
      icon: "✓",
      color: "bg-violet-100 text-violet-700",
    },
    {
      label: "Pending Tasks",
      value: pendingTasks,
      detail: "Still to complete",
      icon: "◷",
      color: "bg-amber-100 text-amber-700",
    },
    {
      label: "Active Habits",
      value: totalHabits,
      detail: `${data.totalHabitCompletions ?? 0} total check-ins`,
      icon: "↗",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Study Time",
      value: formatStudyTime(studyMinutes),
      detail: "Total recorded study time",
      icon: "◷",
      color: "bg-sky-100 text-sky-700",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#f7f7fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-7">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Your progress
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Productivity Insights
              </h1>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Your activity, focus, and progress at a glance.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadAnalytics(true)}
              disabled={loading || refreshing}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh Analytics"}
            </button>
          </header>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              Loading your productivity insights...
            </div>
          ) : error && !analytics ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-600">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => loadAnalytics()}
                className="mt-4 rounded-lg bg-red-50 px-4 py-2 font-semibold hover:bg-red-100"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {error && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  Refresh failed: {error}
                </p>
              )}

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                  <article
                    key={card.label}
                    className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {card.label}
                      </p>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${card.color}`}
                      >
                        {card.icon}
                      </span>
                    </div>
                    <p className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {card.detail}
                    </p>
                  </article>
                ))}
              </section>

              <section className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
                  <div className="relative overflow-hidden p-6 sm:p-8">
                    <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet-200/50 blur-3xl" />
                    <div className="relative">
                      <p className="text-sm font-semibold text-violet-700">
                        WEEKLY OVERVIEW
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        Your productivity
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Activity recorded over the last 7 days.
                      </p>

                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                          <p className="text-xs text-slate-500">
                            Tasks created
                          </p>
                          <p className="mt-2 text-2xl font-bold text-violet-700">
                            {weeklyData.reduce(
                              (sum, day) =>
                                sum + (Number(day.tasksCreated) || 0),
                              0
                            )}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                          <p className="text-xs text-slate-500">
                            Study this week
                          </p>
                          <p className="mt-2 text-xl font-bold text-sky-700">
                            {formatStudyTime(totalWeeklyStudy)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center border-t border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
                    <p className="text-sm font-semibold text-slate-500">
                      TASK COMPLETION
                    </p>
                    <div className="mt-5 flex items-center gap-5">
                      <div
                        className="grid h-28 w-28 shrink-0 place-items-center rounded-full"
                        style={{
                          background: `conic-gradient(#762cff ${taskProgress}%, #e9e1ff ${taskProgress}% 100%)`,
                        }}
                      >
                        <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                          <span className="text-xl font-bold text-violet-700">
                            {taskProgress}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {completedTasks} / {totalTasks}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Tasks completed
                        </p>
                        <p className="mt-3 text-xs text-slate-500">
                          {pendingTasks} tasks remaining
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Tasks Created"
                  subtitle="Daily task creation over the last 7 days"
                  weeklyData={weeklyData}
                  valueKey="tasksCreated"
                  maxValue={maxTasks}
                  barColor="bg-violet-500"
                  barBackground="bg-violet-50"
                  valueSuffix=""
                />

                <ChartCard
                  title="Study Activity"
                  subtitle="Daily study minutes over the last 7 days"
                  weeklyData={weeklyData}
                  valueKey="studyMinutes"
                  maxValue={maxStudy}
                  barColor="bg-sky-500"
                  barBackground="bg-sky-50"
                  valueSuffix="m"
                />
              </section>

              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <article className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-violet-700">
                        GOALS
                      </p>
                      <h2 className="mt-2 text-xl font-bold text-slate-900">
                        Goal Progress
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Average progress across your goals
                      </p>
                    </div>
                    <span className="rounded-xl bg-violet-100 px-3 py-2 text-sm font-bold text-violet-700">
                      {goalProgress}%
                    </span>
                  </div>

                  <div className="mt-7 h-3 overflow-hidden rounded-full bg-violet-50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-700"
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-slate-500">
                      {completedGoals} goals completed
                    </span>
                    <span className="font-semibold text-slate-700">
                      {totalGoals} total goals
                    </span>
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-7">
                  <p className="text-sm font-semibold text-emerald-700">
                    CONSISTENCY
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">
                    Habit Activity
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Daily habit check-ins over the last 7 days
                  </p>

                  <div className="mt-6 space-y-4">
                    {weeklyData.map((day) => {
                      const count = Number(day.habitsCompleted) || 0;
                      const max = Math.max(
                        1,
                        ...weeklyData.map(
                          (item) => Number(item.habitsCompleted) || 0
                        )
                      );

                      return (
                        <div key={day.date}>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="text-slate-500">{day.label}</span>
                            <span className="font-semibold text-slate-700">
                              {count}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-emerald-50">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${(count / max) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </section>

              <section className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">
                  Your insights
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  A summary based on your recorded activity.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Insight
                    icon="✓"
                    title="Task progress"
                    text={
                      totalTasks
                        ? `${completedTasks} of ${totalTasks} tasks completed (${taskProgress}%).`
                        : "Add tasks to start tracking your completion progress."
                    }
                    color="bg-violet-100 text-violet-700"
                  />
                  <Insight
                    icon="◷"
                    title="Study time"
                    text={
                      studyMinutes
                        ? `You've recorded ${formatStudyTime(studyMinutes)} of study time.`
                        : "Start a study timer to record your study sessions."
                    }
                    color="bg-sky-100 text-sky-700"
                  />
                  <Insight
                    icon="↗"
                    title="Habit check-ins"
                    text={
                      data.totalHabitCompletions
                        ? `${data.totalHabitCompletions} habit check-ins recorded so far.`
                        : "Check in to your habits to build a record of consistency."
                    }
                    color="bg-emerald-100 text-emerald-700"
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function ChartCard({
  title,
  subtitle,
  weeklyData,
  valueKey,
  maxValue,
  barColor,
  barBackground,
  valueSuffix,
}) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

      <div className="mt-7 flex h-56 items-end justify-between gap-2 sm:gap-3">
        {weeklyData.map((day) => {
          const value = Number(day[valueKey]) || 0;
          const height = value ? Math.max((value / maxValue) * 100, 4) : 0;

          return (
            <div
              key={day.date}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-semibold text-slate-600">
                {value}
                {valueSuffix}
              </span>
              <div
                className={`flex h-40 w-full items-end overflow-hidden rounded-t-xl ${barBackground}`}
              >
                <div
                  className={`w-full rounded-t-xl ${barColor} transition-all duration-700`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{day.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Insight({ icon, title, text, color }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${color}`}
      >
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}
