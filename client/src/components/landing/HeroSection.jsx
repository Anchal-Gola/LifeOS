import { Link } from "react-router-dom";
import {
  APP_NAME,
  APP_DESCRIPTION,
} from "../../constants/appConstants";

function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden bg-[#0b1224] px-5 py-20 sm:px-8 lg:py-24">
      {/* Base background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0b1224] via-[#10182b] to-[#0b1120]" />

      {/* Violet glow - top left */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-violet-500/30 blur-[110px]" />

      {/* Pink glow - top right */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[380px] w-[380px] rounded-full bg-fuchsia-500/25 blur-[115px]" />

      {/* Blue glow - bottom left */}
      <div className="pointer-events-none absolute -bottom-32 left-[8%] h-[360px] w-[360px] rounded-full bg-blue-600/25 blur-[120px]" />

      {/* Purple glow - bottom right */}
      <div className="pointer-events-none absolute -bottom-28 right-[5%] h-[390px] w-[390px] rounded-full bg-purple-600/30 blur-[125px]" />

      {/* Small accent glow */}
      <div className="pointer-events-none absolute right-[25%] top-[35%] h-28 w-28 rounded-full bg-pink-400/10 blur-[70px]" />

      {/* Decorative sparkle */}
      <div className="pointer-events-none absolute bottom-[12%] right-[7%] text-5xl text-violet-300/50 drop-shadow-[0_0_20px_rgba(167,139,250,0.7)]">
        ✦
      </div>

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/95 px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-900 shadow-[0_0_25px_rgba(255,255,255,0.12)] sm:text-sm">
          <span className="text-sm">🚀</span>
          AI-Powered Productivity Platform
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-6xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Your{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Powered
          </span>
          <br />
          Personal Operating System
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
          {APP_DESCRIPTION}
        </p>

        {/* Buttons */}
        <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/login"
            className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(124,58,237,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(217,70,239,0.35)]"
          >
            Get Started
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-transparent px-7 py-3.5 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:border-white/45 hover:bg-white/5"
          >
            Learn More
          </a>
        </div>

        {/* Supporting labels */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-400">
          <span className="text-violet-300">{APP_NAME}</span>

          <span className="h-1 w-1 rounded-full bg-slate-600" />

          <span>Tasks</span>

          <span className="h-1 w-1 rounded-full bg-slate-600" />

          <span>Goals</span>

          <span className="h-1 w-1 rounded-full bg-slate-600" />

          <span>Habits</span>

          <span className="h-1 w-1 rounded-full bg-slate-600" />

          <span>AI</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;