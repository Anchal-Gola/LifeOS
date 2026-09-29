import { stats } from "../../data/landingData";

function StatsSection() {
  const accents = [
    {
      gradient: "from-violet-600 to-purple-500",
      glow: "bg-violet-400/20",
    },
    {
      gradient: "from-pink-600 to-fuchsia-500",
      glow: "bg-pink-400/20",
    },
    {
      gradient: "from-blue-600 to-cyan-500",
      glow: "bg-blue-400/20",
    },
    {
      gradient: "from-emerald-600 to-teal-500",
      glow: "bg-emerald-400/20",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f5f3ff] px-5 py-24 sm:px-8 lg:py-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/15 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-pink-300/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            LifeOS at a Glance
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Built Around
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Your Life
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Everything you need to stay organized, focused, and in control.
          </p>
        </div>

        {/* Metrics */}
        <div className="relative mt-16 overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/75 p-3 shadow-[0_20px_60px_rgba(30,41,59,0.08)] backdrop-blur-md sm:p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const accent = accents[index % accents.length];

              return (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_18px_40px_rgba(99,102,241,0.10)]"
                >
                  {/* Glow */}
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${accent.glow} blur-[60px] opacity-60 transition duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative">
                    {/* Number */}
                    <div
                      className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent.gradient} text-sm font-black text-white shadow-lg`}
                    >
                      ✦
                    </div>

                    <div
                      className={`mt-5 bg-gradient-to-r ${accent.gradient} bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl`}
                    >
                      {stat.value}
                    </div>

                    <p className="mx-auto mt-3 max-w-[180px] text-sm font-bold leading-6 text-slate-600">
                      {stat.label}
                    </p>

                    {/* Accent line */}
                    <div className="mx-auto mt-6 h-1 w-10 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full w-5 rounded-full bg-gradient-to-r ${accent.gradient} transition-all duration-300 group-hover:w-10`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 text-center">
          <p className="text-sm font-semibold text-slate-400">
            One system for{" "}
            <span className="text-violet-600">work, learning, habits,</span>{" "}
            and everyday life.
          </p>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;