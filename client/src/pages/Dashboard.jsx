
import { useEffect, useState } from "react";
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

  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 px-5 py-8 sm:px-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Good morning, Anchal 👋
            </h1>

            <p className="mt-2 text-slate-500">
              Here's what's happening with your life today.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {dashboardLoading ? (
              <>
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm"
                  />
                ))}
              </>
            ) : dashboard ? (
              <>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="text-sm font-medium text-slate-500">
                    Tasks
                  </span>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {dashboard.summary.totalTasks}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Tasks planned
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="text-sm font-medium text-slate-500">
                    Habits
                  </span>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {dashboard.summary.totalHabits}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Active habits
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="text-sm font-medium text-slate-500">
                    Goals
                  </span>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {dashboard.summary.totalGoals}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Goals you're working on
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className="text-sm font-medium text-slate-500">
                    Study
                  </span>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    {dashboard.summary.totalStudyMinutes}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Minutes studied
                  </p>
                </div>
              </>
            ) : (
              <div className="col-span-full rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
                Unable to load dashboard data.
              </div>
            )}

          </div>

          {/* LifeOS Intelligence */}
          <div className="mb-8 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">

            <div className="mb-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
                🧠
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                LifeOS Insights
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Personalized insights based on your LifeOS activity.
              </p>
            </div>

            {intelligenceLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-28 animate-pulse rounded-2xl bg-slate-50"
                  />
                ))}
              </div>
            ) : !intelligence ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="text-3xl">🧠</div>

                <p className="mt-3 font-semibold text-slate-800">
                  Insights unavailable
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  We couldn't load your LifeOS insights right now.
                </p>
              </div>
            ) : intelligence.insights.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="text-3xl">🧠</div>

                <p className="mt-3 font-semibold text-slate-800">
                  No insights yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Keep using LifeOS and personalized insights will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {intelligence.insights.map((insight, index) => (
                  <div
                    key={`${insight.type}-${index}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                        {getInsightIcon(insight.type)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900">
                          {insight.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {insight.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Today's Focus */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                Today's Focus
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Stay focused on what matters today.
              </p>
            </div>

            {dashboardLoading ? (
              <div className="space-y-3">
                <div className="h-20 animate-pulse rounded-2xl bg-slate-50" />
                <div className="h-20 animate-pulse rounded-2xl bg-slate-50" />
              </div>
            ) : !dashboard ? (
              <p className="text-sm text-red-500">
                Unable to load today's tasks.
              </p>
            ) : dashboard.tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="text-3xl">🎉</div>

                <p className="mt-3 font-semibold text-slate-800">
                  No tasks for today
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  You're all clear!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboard.tasks.map((task) => (
                  <div
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    key={task._id}
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {task.description || "No description"}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold capitalize text-purple-600">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;

