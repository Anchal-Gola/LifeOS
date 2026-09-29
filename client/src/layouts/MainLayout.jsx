import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("lifeos-sidebar-collapsed") === "true";
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;

      localStorage.setItem(
        "lifeos-sidebar-collapsed",
        String(next)
      );

      return next;
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--lifeos-sidebar-width",
      sidebarCollapsed ? "76px" : "260px"
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--lifeos-sidebar-width"
      );
    };
  }, [sidebarCollapsed]);

  return (
    <div
      className={`min-h-screen bg-[#f7f7ff] ${
        sidebarCollapsed
          ? "lifeos-sidebar-collapsed"
          : "lifeos-sidebar-expanded"
      }`}
    >
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <main className="min-h-screen pt-20 transition-[padding-left] duration-300 ease-in-out lg:pl-[var(--lifeos-sidebar-width)]">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;