import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { menuItems } from "../privateData/menu";
import { MdOutlineMenuOpen } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import useAuth from "@/stores/authStores";

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const Private_Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  const firstLetter = user?.name?.charAt(0).toUpperCase() ?? "?";
  const displayName = user?.name ? toTitleCase(user.name) : "";

  return (
    <aside
      className={`
        h-screen bg-[#1e1b4b] text-white flex flex-col
        transition-[width] duration-300 ease-in-out overflow-hidden flex-shrink-0
        ${collapsed ? "w-14" : "w-60"}
      `}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/10 min-h-[56px]">
        {!collapsed && (
          <span className="text-sm font-medium tracking-wide text-indigo-200 whitespace-nowrap">
            AdminPanel
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/15 text-indigo-300
                     flex items-center justify-center transition-colors duration-150 flex-shrink-0"
          aria-label={collapsed ? "Sidebar expand karo" : "Sidebar collapse karo"}
        >
          <MdOutlineMenuOpen
            size={18}
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}
          />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={`
                flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm
                transition-colors duration-150 whitespace-nowrap overflow-hidden
                ${isActive
                  ? "bg-indigo-500/30 text-indigo-200 font-medium"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
                }
              `}
            >
              {Icon && <Icon size={18} className="flex-shrink-0" />}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-white/10 px-2 py-3 space-y-2">
        {/* User info */}
        <div className="flex items-center gap-2.5 px-1 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center
                          text-white text-xs font-semibold flex-shrink-0">
            {firstLetter}
          </div>

          {!collapsed && (
            <div className="overflow-hidden leading-tight">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout();  }}
          className={`
            w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium
            bg-red-500/10 text-red-400 hover:bg-red-500/20
            transition-colors duration-150
            ${collapsed ? "justify-center" : "justify-start"}
          `}
        >
          <LuLogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Private_Sidebar;