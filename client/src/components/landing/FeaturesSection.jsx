import { features } from "../../data/landingData";

function FeaturesSection() {
  const accents = [
    {
      gradient: "from-blue-500 to-cyan-400",
      glow: "bg-blue-400/20",
      border: "hover:border-blue-300",
    },
    {
      gradient: "from-violet-500 to-fuchsia-500",
      glow: "bg-violet-400/20",
      border: "hover:border-violet-300",
    },
    {
      gradient: "from-emerald-500 to-teal-400",
      glow: "bg-emerald-400/20",
      border: "hover:border-emerald-300",
    },
    {
      gradient: "from-pink-500 to-rose-400",
      glow: "bg-pink-400/20",
      border: "hover:border-pink-300",
    },
    {
      gradient: "from-indigo-500 to-blue-500",
      glow: "bg-indigo-400/20",
      border: "hover:border-indigo-300",
    },
    {
      gradient: "from-purple-500 to-pink-500",
      glow: "bg-purple-400/20",
      border: "hover:border-purple-300",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#f5f3ff] px-5 py-24 sm:px-8 sm:py-28"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute left-[-120px] top-[10%] h-72 w-72 rounded-full bg-violet-300/20 blur-[110px]" />
      <div className="pointer-events-none absolute right-[-120px] top-[35%] h-80 w-80 rounded-full bg-fuchsia-300/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-140px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-300/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            LifeOS Features
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Everything You Need
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              to Run Your Life
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            One intelligent system that brings your tasks, goals, habits,
            planning, and AI assistance together.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const accent = accents[index % accents.length];

            return (
              <article
                key={feature.title}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_14px_45px_rgba(30,41,59,0.07)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 ${accent.border} hover:shadow-[0_24px_55px_rgba(99,102,241,0.14)]`}
              >
                {/* Glow */}
                <div
                  className={`pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${accent.glow} blur-[65px] opacity-60 transition duration-300 group-hover:opacity-100`}
                />

                <div className="relative">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.gradient} text-2xl text-white shadow-lg`}
                    >
                      {feature.icon}
                    </div>

                    <span className="text-xs font-black tracking-[0.12em] text-slate-300">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-7 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                    {feature.description}
                  </p>

                  {/* Bottom visual */}
                  <div className="mt-7 flex items-center gap-2">
                    <div
                      className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${accent.gradient} transition-all duration-300 group-hover:w-14`}
                    />

                    <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom statement */}
        <div className="mt-14 text-center">
          <p className="text-sm font-semibold text-slate-400">
            One workspace. Multiple parts of life.{" "}
            <span className="text-violet-600">One LifeOS.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;