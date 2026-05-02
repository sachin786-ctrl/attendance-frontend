import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet } from "react-router";
import Private_Footer from "@/pages/private/common/Private_Footer";
import Private_Sidebar from "@/pages/private/common/Private_Sidebar";
import Private_Topbar from "@/pages/private/common/Private_Topbar";
import useAuth from "@/stores/authStores";

const PrivateRoute = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authStatus = useAuth((state) => state.authStatus);
  const user = useAuth((state) => state.user);
  const firstLetter = user?.name?.charAt(0).toUpperCase();
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!authStatus) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-30 inset-y-0 left-0 lg:static lg:z-auto transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Private_Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="flex-shrink-0">
          {/* Mobile hamburger */}
          <div className="h-14 bg-white px-4 border-b border-slate-200 flex items-center justify-between  lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg text-slate-500 hover:bg-slate-100 mr-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <header className="h-14  border-b border-slate-200 flex items-center justify-end ">
              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2  rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {firstLetter}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block">
                      {user?.name
                        ? user.name
                            .toLowerCase()
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1),
                            )
                            .join(" ")
                        : ""}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400 hidden sm:block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            // navigate("/login");
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>
          </div>

          {/* Desktop Topbar */}
          <div className="hidden lg:block">
            <Private_Topbar />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-4 md:p-6 flex-1">
            <Outlet />
          </div>
          <Private_Footer />
        </main>
      </div>
    </div>
  );
};

export default PrivateRoute;
