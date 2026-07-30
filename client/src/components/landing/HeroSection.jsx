import {
  APP_NAME,
  APP_DESCRIPTION,
} from "../../constants/appConstants";
function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">

      <p className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium">
        🚀 AI-Powered Productivity Platform
      </p>

      <h1 className="mt-8 text-6xl md:text-7xl font-extrabold leading-tight">
        Your{" "}
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI-Powered
        </span>
        <br />
        Personal Operating System
      </h1>

      <p className="mt-8 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
  {APP_DESCRIPTION}
    </p>

      <div className="mt-10 flex gap-6">
        <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:scale-105 transition">
          Get Started
        </button>

        <button className="px-8 py-4 rounded-xl border dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
          Learn More
        </button>
      </div>

    </section>
  );
}

export default HeroSection;