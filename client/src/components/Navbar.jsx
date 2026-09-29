import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),

    ai: (
      <>
        <path d="M12 3v2" />
        <path d="M12 19v2" />
        <path d="M3 12h2" />
        <path d="M19 12h2" />
        <path d="m5.6 5.6 1.4 1.4" />
        <path d="m17 17 1.4 1.4" />
        <path d="m18.4 5.6-1.4 1.4" />
        <path d="m7 17-1.4 1.4" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),

    tasks: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </>
    ),

    goals: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),

    habits: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-4" />
        <path d="M4 4v5h5" />
        <path d="M4 13a8 8 0 0 0 14.9 4" />
        <path d="M20 20v-5h-5" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 9h18" />
        <path d="M8 13h.01" />
        <path d="M12 13h.01" />
        <path d="M16 13h.01" />
        <path d="M8 17h.01" />
        <path d="M12 17h.01" />
      </>
    ),

    journal: (
      <>
        <path d="M6 4h11a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2V4Z" />
        <path d="M6 18h13" />
        <path d="M10 8h5" />
        <path d="M10 12h5" />
      </>
    ),

    notes: (
      <>
        <path d="M5 3h10l4 4v14H5z" />
        <path d="M15 3v5h4" />
        <path d="M8 12h8" />
        <path d="M8 16h6" />
      </>
    ),

    study: (
      <>
        <path d="m4 6 8-3 8 3-8 3-8-3Z" />
        <path d="M6 9v5c0 1.5 2.7 3 6 3s6-1.5 6-3V9" />
        <path d="M20 7v6" />
      </>
    ),

    documents: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M15 3v5h4" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </>
    ),

    notifications: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),

    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    chevronLeft: <path d="m14 8-4 4 4 4" />,

    chevronRight: <path d="m10 8 4 4-4 4" />,

    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
};

function Navbar({
  sidebarCollapsed = false,
  onToggleSidebar,
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    if (isLandingPage || !user) return;

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
          `http://localhost:5000/api/search?q=${encodeURIComponent(
            query
          )}`,
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
  }, [search, isLandingPage, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
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

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname, location.hash]);

  const getResultIcon = (type) => {
    const icons = {
      task: "✓",
      note: "N",
      goal: "◎",
      habit: "↻",
      journal: "J",
      study: "S",
      document: "D",
      event: "C",
    };

    return icons[type] || "⌕";
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

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.location.hash = id;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getUserInitial = () => {
    if (!user?.name) return "U";

    return user.name.trim().charAt(0).toUpperCase();
  };

  const navigationGroups = [
    {
      title: "Workspace",
      items: [
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: "dashboard",
        },
        {
          label: "AI Assistant",
          path: "/ai",
          icon: "ai",
        },
        {
          label: "Tasks",
          path: "/tasks",
          icon: "tasks",
        },
        {
          label: "Goals",
          path: "/goals",
          icon: "goals",
        },
        {
          label: "Habits",
          path: "/habits",
          icon: "habits",
        },
        {
          label: "Calendar",
          path: "/calendar",
          icon: "calendar",
        },
      ],
    },

    {
      title: "Personal",
      items: [
        {
          label: "Journal",
          path: "/journal",
          icon: "journal",
        },
        {
          label: "Notes",
          path: "/notes",
          icon: "notes",
        },
        {
          label: "Study Workspace",
          path: "/study-workspace",
          icon: "study",
        },
        {
          label: "Documents",
          path: "/documents",
          icon: "documents",
        },
        {
          label: "Notifications",
          path: "/notifications",
          icon: "notifications",
        },
      ],
    },
  ];

  const isActive = (item) => {
    return location.pathname === item.path;
  };

  const renderNavigation = (mobile = false) => (
    <div className="space-y-7">
      {navigationGroups.map((group) => (
        <div key={group.title}>
          {!sidebarCollapsed || mobile ? (
            <p className="mb-2.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
              {group.title}
            </p>
          ) : (
            <div className="mx-2 mb-3 h-px bg-slate-100" />
          )}

          <div className="space-y-1.5">
            {group.items.map((item) => {
              const active = isActive(item);

              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  title={
                    !mobile && sidebarCollapsed
                      ? item.label
                      : undefined
                  }
                  className={`group flex w-full items-center rounded-2xl transition-all duration-200 ${sidebarCollapsed && !mobile
                    ? "justify-center px-2 py-2.5"
                    : "gap-3 px-3 py-2.5"
                    } ${active
                      ? "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-violet-200"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active
                      ? "bg-white/15"
                      : "bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-violet-600"
                      }`}
                  >
                    <Icon name={item.icon} size={18} />
                  </span>

                  {!sidebarCollapsed && (
                    <span className="truncate text-sm font-semibold">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  /* =========================================================
     PUBLIC LANDING NAVBAR
     ========================================================= */

  if (isLandingPage) {
    return (
      <nav className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl"
          >
            LifeOS
          </button>

          {!loading && (
            <>
              {/* Logged out */}
              {!user ? (
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    Features
                  </button>

                  <button
                    onClick={() => scrollToSection("about")}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    About
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="ml-1 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Get Started
                    <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              ) : (
                /* Logged in */
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    onClick={() => scrollToSection("features")}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    Features
                  </button>

                  <button
                    onClick={() => scrollToSection("about")}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    About
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="ml-1 rounded-xl bg-violet-50 px-4 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
                  >
                    Dashboard
                  </button>

                  <div ref={accountRef} className="relative ml-1">
                    <button
                      onClick={() =>
                        setAccountMenuOpen((current) => !current)
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-extrabold text-white shadow-md shadow-violet-200"
                      aria-label="Open account menu"
                    >
                      {getUserInitial()}
                    </button>

                    {accountMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-violet-100 bg-white p-2 shadow-2xl">
                        <div className="border-b border-slate-100 px-3 py-3">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate("/dashboard")}
                          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Icon name="dashboard" size={17} />
                          Dashboard
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <Icon name="logout" size={17} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile */}
              <div className="flex items-center gap-2 md:hidden">
                {user && (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-extrabold text-white shadow-md shadow-violet-200"
                  >
                    {getUserInitial()}
                  </button>
                )}

                {!user && (
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-200"
                  >
                    Get Started
                  </button>
                )}

                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-white text-slate-600 shadow-sm"
                  aria-label="Open navigation"
                >
                  <Icon name="menu" size={19} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Public Menu */}
        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-[76px] border-b border-violet-100 bg-white p-4 shadow-xl md:hidden">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection("features");
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-violet-50"
              >
                Features
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection("about");
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-violet-50"
              >
                About
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-violet-700 hover:bg-violet-50"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-violet-50"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }

  /* =========================================================
     LOGGED-IN APP SHELL
     ========================================================= */

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-50 hidden border-r border-violet-100 bg-white lg:block"
        style={{
          width: sidebarCollapsed ? "76px" : "260px",
          transition:
            "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex h-20 items-center border-b border-violet-100 ${sidebarCollapsed
              ? "justify-center px-2"
              : "justify-between px-5"
              }`}
          >
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
              style={{
                fontSize: sidebarCollapsed ? "25px" : "30px",
                lineHeight: "1",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {sidebarCollapsed ? "L" : "LifeOS"}
            </button>

            <button
              type="button"
              onClick={onToggleSidebar}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-white text-slate-400 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              title={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              aria-label={
                sidebarCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              <Icon
                name={
                  sidebarCollapsed
                    ? "chevronRight"
                    : "chevronLeft"
                }
                size={17}
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            {renderNavigation()}
          </div>

          <div className="border-t border-violet-100 p-3">
            {!sidebarCollapsed ? (
              <div className="rounded-2xl bg-gradient-to-br from-violet-50 via-fuchsia-50 to-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                    <Icon name="ai" size={16} />
                  </span>

                  <p className="text-xs font-bold text-violet-700">
                    LifeOS Intelligence
                  </p>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Your personal productivity system is ready.
                </p>
              </div>
            ) : (
              <div
                className="flex h-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"
                title="LifeOS Intelligence"
              >
                <Icon name="ai" size={17} />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Desktop App Header */}
      <header
        className="fixed right-0 top-0 z-40 hidden h-20 border-b border-violet-100 bg-white/95 shadow-[0_4px_24px_rgba(99,102,241,0.06)] backdrop-blur-xl lg:block"
        style={{
          left: sidebarCollapsed ? "76px" : "260px",
          transition:
            "left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex h-full items-center gap-3 px-4 sm:px-6">
          <div className="hidden min-w-fit xl:block">
            <span className="rounded-xl bg-violet-50 px-5 py-3 text-base font-bold tracking-wide text-violet-700">
              {location.pathname === "/dashboard"
                ? "Daily overview"
                : "LifeOS workspace"}
            </span>
          </div>

          {/* Search */}
          <div
            ref={searchRef}
            className="relative ml-auto w-full max-w-2xl"
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-400">
                <Icon name="search" size={18} />
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
                placeholder="Search anything in LifeOS..."
                className="w-full rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50/70 via-white to-blue-50/60 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>

            {showResults && search.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-violet-100 bg-white p-2 shadow-2xl">
                {searching ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    Searching...
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="flex justify-center text-violet-400">
                      <Icon name="search" size={24} />
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
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
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={() =>
                          handleResultClick(result)
                        }
                        className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-violet-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-sm font-bold text-violet-700">
                          {getResultIcon(result.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {result.title || "Untitled"}
                          </p>

                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                            {result.description ||
                              "No description"}
                          </p>

                          <span className="mt-1 inline-block text-[11px] font-bold uppercase tracking-wide text-violet-600">
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

          {/* Authenticated Account */}
          <div
            ref={accountRef}
            className="relative flex shrink-0 items-center gap-2"
          >
            <button
              onClick={() => navigate("/notifications")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-white text-slate-500 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              title="Notifications"
              aria-label="Notifications"
            >
              <Icon name="notifications" size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-100 bg-white text-slate-600 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "☾" : "☀"}
            </button>

            {!loading && user && (
              <button
                onClick={() =>
                  setAccountMenuOpen((current) => !current)
                }
                className="ml-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-extrabold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                title="Account"
                aria-label="Account"
              >
                {getUserInitial()}
              </button>
            )}

            {accountMenuOpen && user && (
              <div className="absolute right-0 top-14 w-60 overflow-hidden rounded-2xl border border-violet-100 bg-white p-2 shadow-2xl">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setAccountMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                >
                  <Icon name="dashboard" size={17} />
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Icon name="logout" size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile App Header */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-20 items-center gap-3 border-b border-violet-100 bg-white/95 px-4 shadow-sm backdrop-blur-xl lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white text-slate-600 shadow-sm"
          aria-label="Open navigation"
        >
          <Icon name="menu" size={20} />
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-xl font-extrabold text-transparent"
        >
          LifeOS
        </button>

        <div
          ref={searchRef}
          className="relative ml-auto min-w-0 flex-1"
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-violet-400">
              <Icon name="search" size={17} />
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-violet-100 bg-violet-50/60 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-white text-slate-600 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "light" ? "☾" : "☀"}
        </button>

        {user && (
          <button
            onClick={() =>
              setAccountMenuOpen((current) => !current)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-extrabold text-white"
            aria-label="Account"
          >
            {getUserInitial()}
          </button>
        )}

        {accountMenuOpen && user && (
          <div
            ref={accountRef}
            className="absolute right-4 top-[68px] w-56 rounded-2xl border border-violet-100 bg-white p-2 shadow-2xl"
          >
            <div className="border-b border-slate-100 px-3 py-3">
              <p className="truncate text-sm font-bold text-slate-900">
                {user.name}
              </p>

              <p className="truncate text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => {
                setAccountMenuOpen(false);
                navigate("/dashboard");
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-violet-50"
            >
              <Icon name="dashboard" size={17} />
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              <Icon name="logout" size={17} />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-[292px] border-r border-violet-100 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-full flex-col">
              <div className="flex h-20 items-center justify-between border-b border-violet-100 px-5">
                <button
                  onClick={() => navigate("/")}
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent"
                >
                  LifeOS
                </button>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-600"
                  aria-label="Close navigation"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5">
                {renderNavigation(true)}
              </div>

              {user && (
                <div className="border-t border-violet-100 p-4">
                  <div className="mb-3 flex items-center gap-3 rounded-2xl bg-violet-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-extrabold text-white">
                      {getUserInitial()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <Icon name="logout" size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Navbar;