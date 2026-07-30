import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          LifeOS
        </h2>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">

          <a href="#features" className="hover:text-indigo-500 transition">
            Features
          </a>

          <a href="#about" className="hover:text-indigo-500 transition">
            About
          </a>

          <button
            onClick={toggleTheme}
            className="w-11 h-11 rounded-xl border border-gray-300 dark:border-slate-700 hover:scale-105 transition"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition">
            Login
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;