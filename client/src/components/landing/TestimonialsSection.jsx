function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Software Engineer",
      review:
        "LifeOS helped me organize my work and personal life in one place.",
      gradient: "from-violet-600 to-purple-500",
      glow: "bg-violet-400/20",
    },
    {
      name: "Sarah Lee",
      role: "Product Designer",
      review:
        "The AI Assistant saves me hours every week. It feels like a personal productivity coach.",
      gradient: "from-fuchsia-600 to-pink-500",
      glow: "bg-fuchsia-400/20",
    },
    {
      name: "David Kim",
      role: "Entrepreneur",
      review:
        "Beautiful design, smart features, and everything I need in a single app.",
      gradient: "from-blue-600 to-cyan-500",
      glow: "bg-blue-400/20",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eeeaff] via-[#f7f7ff] to-white px-5 py-24 sm:px-8 sm:py-28">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-violet-400/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-500" />
            Early Feedback
          </span>

          <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Built for Real
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Life
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            See how people are using LifeOS to bring more of their everyday
            life into one system.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {testimonials.map((user, index) => (
            <article
              key={user.name}
              className={`group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-7 shadow-[0_16px_45px_rgba(30,41,59,0.07)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_55px_rgba(99,102,241,0.13)]`}
            >
              {/* Accent glow */}
              <div
                className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full ${user.glow} opacity-60 blur-[65px] transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative">
                {/* Quote */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${user.gradient} text-2xl font-black text-white shadow-lg`}
                  >
                    “
                  </div>

                  <div className="flex gap-1 text-sm text-amber-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>

                {/* Review */}
                <p className="mt-7 min-h-[132px] text-[15px] leading-7 text-slate-600 sm:text-base">
                  “{user.review}”
                </p>

                {/* Divider */}
                <div className="my-6 h-px bg-slate-100" />

                {/* Person */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.gradient} text-sm font-black text-white shadow-md`}
                  >
                    {user.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-extrabold text-slate-900">
                      {user.name}
                    </h3>

                    <p
                      className={`mt-0.5 text-sm font-semibold ${
                        index === 0
                          ? "text-violet-600"
                          : index === 1
                            ? "text-pink-600"
                            : "text-blue-600"
                      }`}
                    >
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className={`mt-7 h-1.5 w-10 rounded-full bg-gradient-to-r ${user.gradient} transition-all duration-300 group-hover:w-16`}
                />
              </div>
            </article>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-slate-400 sm:text-base">
            One system for the things that matter most.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;