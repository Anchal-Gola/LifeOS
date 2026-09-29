import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";

function Home() {
  const modules = [
    {
      title: "Tasks",
      description: "Organize what needs to get done.",
      icon: "✓",
      path: "/tasks",
      className:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300",
    },
    {
      title: "Goals",
      description: "Track your progress and milestones.",
      icon: "◈",
      path: "/goals",
      className:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300",
    },
    {
      title: "Habits",
      description: "Build routines that actually stick.",
      icon: "↗",
      path: "/habits",
      className:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    {
      title: "Study",
      description: "Keep your learning organized.",
      icon: "▣",
      path: "/study",
      className:
        "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-300",
    },
    {
      title: "Calendar",
      description: "See everything happening around you.",
      icon: "□",
      path: "/calendar",
      className:
        "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300",
    },
    {
      title: "Journal",
      description: "Capture thoughts and reflect.",
      icon: "✎",
      path: "/journal",
      className:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    },
  ];

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] bg-[#f7f7fb] px-5 py-6 text-slate-900 dark:bg-[#101118] dark:text-white sm:px-8 lg:px-10">

        <div className="mx-auto max-w-7xl">

          {/* Hero */}
          <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-sm dark:border-white/[0.07] dark:bg-[#15161e] sm:px-10 sm:py-12 lg:px-14">

            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-100 blur-3xl dark:bg-violet-500/10" />

            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-100 blur-3xl dark:bg-blue-500/10" />

            <div className="relative max-w-3xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 dark:border-violet-500/20 dark:bg-violet-500/10">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">
                  LifeOS Workspace
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                Your life,
                <br />
                <span className="text-violet-600 dark:text-violet-400">
                  organized in one place.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                LifeOS brings your tasks, goals, habits, studies,
                notes, and plans together so you can focus on what
                matters most.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <Link
                  to="/dashboard"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  Open Dashboard
                </Link>

                <Link
                  to="/ai"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-600 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300 dark:hover:border-violet-500/30 dark:hover:text-violet-300"
                >
                  Ask LifeOS AI
                </Link>

              </div>
            </div>
          </section>

          {/* Quick access */}
          <section className="mt-8">

            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Workspace
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                  Quick access
                </h2>
              </div>

              <Link
                to="/dashboard"
                className="hidden text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 sm:block"
              >
                View dashboard →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {modules.map((module) => (
                <Link
                  key={module.title}
                  to={module.path}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-white/[0.07] dark:bg-[#15161e] dark:hover:border-white/[0.12]"
                >
                  <div className="flex items-start justify-between">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${module.className}`}
                    >
                      {module.icon}
                    </div>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500 dark:text-slate-600">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {module.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-400 dark:text-slate-500">
                    {module.description}
                  </p>
                </Link>
              ))}

            </div>
          </section>

          {/* AI section */}
          <section className="mt-8 mb-4">

            <div className="overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/70 dark:border-violet-500/15 dark:bg-violet-500/[0.06]">

              <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Need help deciding what to do next?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Ask LifeOS AI to plan your day, organize
                      your work, or help you stay on track.
                    </p>
                  </div>

                </div>

                <Link
                  to="/ai"
                  className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-violet-700"
                >
                  Open AI Assistant
                </Link>

              </div>
            </div>

          </section>

        </div>
      </div>
    </MainLayout>
  );
}

export default Home;