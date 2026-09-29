import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#eeeaff] px-5 py-24 sm:px-8 sm:py-28">
      {/* Soft transition from testimonials */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#eeeaff] to-transparent" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-violet-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-pink-500/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-violet-300/20 bg-[#0b1224] px-6 py-16 text-center shadow-[0_30px_90px_rgba(76,29,149,0.20)] sm:px-10 sm:py-20 lg:px-16">
          {/* CTA background atmosphere */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#11183a] via-[#15102f] to-[#0b1224]" />

          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-[-100px] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[100px]" />

          <div className="relative">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/25 bg-violet-400/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-300">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
              Start with LifeOS
            </span>

            {/* Heading */}
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Ready to{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Organize
              </span>{" "}
              Your Life?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Join LifeOS and let AI manage your tasks, notes, habits,
              calendar, and productivity—all from one place.
            </p>

            {/* CTA */}
            <Link
  to="/login"
  className="group mt-10 inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-extrabold !text-violet-700 shadow-[0_0_30px_rgba(255,255,255,0.10)] transition duration-300 hover:-translate-y-1 hover:bg-violet-50 hover:!text-violet-800 hover:shadow-[0_0_40px_rgba(196,181,253,0.25)]"
>
              Get Started Free
              <span className="ml-2 text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            {/* Supporting line */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500 sm:text-sm">
              <span className="text-violet-300">Tasks</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>Goals</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>Habits</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>Calendar</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span>AI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;