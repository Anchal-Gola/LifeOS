function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-[#f8f8fc] px-5 py-24 sm:px-8 lg:py-28">
      {/* Soft ambient background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-32 h-96 w-96 rounded-full bg-pink-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            LifeOS Workspace
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
            Everything in{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              one place
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            A smarter workspace for your daily life.
          </p>
        </div>

        {/* Main preview frame */}
        <div className="relative mt-14 overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white p-3 shadow-[0_25px_80px_rgba(30,41,59,0.10)] sm:p-5 lg:p-6">
          {/* Subtle inner accent */}
          <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-gradient-to-br from-violet-50/70 via-transparent to-pink-50/60" />

          {/* Top preview bar */}
          <div className="relative flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-[#fafaff] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Overview
              </p>

              <h3 className="mt-1 text-xl font-extrabold text-[#172033] sm:text-2xl">
                Your daily workspace
              </h3>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Productivity +42%
            </div>
          </div>

          {/* Preview modules */}
          <div className="relative mt-4 grid gap-4 lg:grid-cols-3">
            {/* Tasks */}
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/60">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
                    📝
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-700">
                    Tasks
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Pending
                  </p>

                  <p className="mt-1 text-5xl font-black tracking-tight text-[#172033]">
                    12
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Tasks waiting for you
                  </p>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Today</span>
                    <span>68%</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-[68%] rounded-full bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Habits */}
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/60">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white shadow-lg shadow-emerald-200">
                    ✓
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                    Habits
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Completed
                  </p>

                  <p className="mt-1 text-5xl font-black tracking-tight text-[#172033]">
                    5 / 6
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Daily habits completed
                  </p>
                </div>

                <div className="mt-7">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Daily streak</span>
                    <span>83%</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full w-[83%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Intelligence */}
            <div className="group relative overflow-hidden rounded-[1.5rem] border border-fuchsia-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:shadow-lg hover:shadow-fuchsia-100/60">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-200/40 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xl text-white shadow-lg shadow-fuchsia-200">
                    🤖
                  </div>

                  <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-fuchsia-700">
                    Intelligence
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-5xl font-black tracking-tight text-[#172033]">
                    Ready
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    AI Assistant is online
                  </p>
                </div>

                <div className="mt-7 flex items-center gap-2 rounded-xl border border-fuchsia-100 bg-fuchsia-50 px-3 py-2.5 text-xs font-bold text-fuchsia-700">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-500" />
                  System operational
                </div>
              </div>
            </div>
          </div>

          {/* Bottom navigation strip */}
          <div className="relative mt-4 flex flex-wrap items-center justify-center gap-3 rounded-[1.5rem] border border-slate-200 bg-[#fafaff] px-5 py-4 text-xs font-semibold text-slate-400 sm:gap-5">
            <span className="text-violet-600">Dashboard</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Tasks</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Goals</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Habits</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;