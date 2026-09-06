import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      const query = search.trim();

      if (!query) {
        setResults([]);
        setShowResults(false);
        return;
      }

      try {
        setSearching(true);
        setShowResults(true);

        const response = await axios.get(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`,
          {
            withCredentials: true,
          }
        );

        setResults(response.data.data || []);
      } catch (error) {
        console.error("Global search error:", error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const getResultIcon = (type) => {
    const icons = {
      task: "✅",
      note: "📝",
      goal: "🎯",
      habit: "🔁",
      journal: "📔",
      study: "📚",
      document: "📄",
      event: "📅",
    };

    return icons[type] || "🔎";
  };

  const getResultPath = (type) => {
    const paths = {
      task: "/tasks",
      note: "/notes",
      goal: "/goals",
      habit: "/habits",
      journal: "/journal",
      study: "/study-workspace",
      document: "/documents",
      event: "/calendar",
    };

    return paths[type] || "/";
  };

  const handleResultClick = (result) => {
    setSearch("");
    setShowResults(false);
    navigate(getResultPath(result.type));
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-8 py-4">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="shrink-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent"
        >
          LifeOS
        </button>

        {/* Global Search */}
        <div
          ref={searchRef}
          className="relative hidden max-w-md flex-1 lg:block"
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (search.trim()) {
                  setShowResults(true);
                }
              }}
              placeholder="Search LifeOS..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-purple-500"
            />
          </div>

          {/* Search Results */}
          {showResults && search.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {searching ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  Searching...
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-2xl">🔎</div>

                  <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try another search term.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-lg dark:bg-purple-900/30">
                        {getResultIcon(result.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                          {result.title || "Untitled"}
                        </p>

                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                          {result.description || "No description"}
                        </p>

                        <span className="mt-1 inline-block text-[11px] font-medium uppercase tracking-wide text-purple-500">
                          {result.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">

          <button
            onClick={() => navigate("/dashboard")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/ai")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            AI
          </button>

          <button
            onClick={() => navigate("/tasks")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Tasks
          </button>

          <button
            onClick={() => navigate("/goals")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Goals
          </button>

          <button
            onClick={() => navigate("/habits")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Habits
          </button>

          <button
            onClick={() => navigate("/calendar")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Calendar
          </button>

          <button
            onClick={() => navigate("/journal")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Journal
          </button>

          <button
            onClick={() => navigate("/notes")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Notes
          </button>

          <button
            onClick={() => navigate("/study-workspace")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Study Workspace
          </button>

          <button
            onClick={() => navigate("/documents")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Documents
          </button>

          <button
            onClick={() => navigate("/notifications")}
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Notifications
          </button>

          <a
            href="/#features"
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            Features
          </a>

          <a
            href="/#about"
            className="font-medium text-slate-700 transition hover:text-indigo-500 dark:text-slate-200"
          >
            About
          </a>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 transition hover:scale-105 dark:border-slate-700"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Login */}
          <button
            onClick={handleLogin}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-white transition hover:opacity-90"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;