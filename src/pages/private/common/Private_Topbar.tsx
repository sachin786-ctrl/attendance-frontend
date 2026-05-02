import useAuth from "@/stores/authStores";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { logoImages } from "../privateData/stats";

const Private_Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuth((state) => state.user);
  const firstLetter = user?.name?.charAt(0).toUpperCase();
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  


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

  return (
    <header className="h-14  bg-white border-b border-slate-200 flex items-center justify-between px-6">
      {/* Left: Page title (dynamic would come via props/context) */}

      <div className="flex items-center gap-4">
        {logoImages.map((src, index) => (
          <img key={index} src={src} alt={`Logo ${index}`} className="object-contain h-32 w-32 " />
        ))}
      </div>
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#322F81] hover:bg-[#1E1B4B] rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="w-7 h-7 rounded-full bg-[#322F81] hover:bg-[#1E1B4B] text-white flex items-center justify-center text-xs font-bold">
              {firstLetter}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {user?.name
                ? user.name
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
                    navigate("/login");
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
  );
};

export default Private_Topbar;
