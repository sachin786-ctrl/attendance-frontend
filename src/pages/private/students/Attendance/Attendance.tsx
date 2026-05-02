import type { AttendanceRecord } from "@/models/Attendance";
import { getHistory } from "@/service/authService";
import useAuth from "@/stores/authStores";
import { useEffect, useState } from "react";
import { FaCalendar, FaCalendarCheck, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router";
 

const Attendance = () => {
  const user = useAuth((state) => state.user);
   const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(setRecords).finally(() => setLoading(false));
  }, []);

  const summary = {
    PRESENT: records.filter((r) => r.status === "PRESENT").length,
    LATE: records.filter((r) => r.status === "LATE").length,
    ABSENT: records.filter((r) => r.status === "ABSENT").length,
  };

  const cards = [
    { label: "Today Attendance", path: "/attendance/today", icon: FaCalendarCheck, color: "bg-[#322F81] text-white" },
    { label: "Calendar", path: "/attendance/calendar", icon: FaCalendar, color: "bg-white border text-slate-800" },
    { label: "History", path: "/attendance/history", icon: FaHistory, color: "bg-white border text-slate-800" },
  ];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Attendance</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome,
          {user?.name
            ? user.name
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : ""}
        </p>
      </div>
 
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border rounded-2xl p-5 text-center">
            {loading ? (
              <p className="text-2xl font-bold text-slate-300">--</p>
            ) : (
              <p className="text-3xl font-bold text-green-600">{summary.PRESENT}</p>
            )}
            <p className="text-sm text-slate-500 mt-1">Present</p>
          </div>
          <div className="bg-white border rounded-2xl p-5 text-center">
            {loading ? (
              <p className="text-2xl font-bold text-slate-300">--</p>
            ) : (
              <p className="text-3xl font-bold text-yellow-500">{summary.LATE}</p>
            )}
            <p className="text-sm text-slate-500 mt-1">Late</p>
          </div>
          <div className="bg-white border rounded-2xl p-5 text-center">
            {loading ? (
              <p className="text-2xl font-bold text-slate-300">--</p>
            ) : (
              <p className="text-3xl font-bold text-red-500">{summary.ABSENT}</p>
            )}
            <p className="text-sm text-slate-500 mt-1">Absent</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`${card.color} rounded-2xl p-5 flex items-center gap-4 hover:opacity-90 transition`}
            >
              <card.icon size={24} />
              <span className="font-semibold">{card.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    </div>
  );
};

export default Attendance;
