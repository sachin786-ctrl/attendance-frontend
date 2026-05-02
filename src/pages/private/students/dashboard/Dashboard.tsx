import type { AttendanceRecord } from "@/models/Attendance";
import { getHistory } from "@/service/authService";
import useAuth from "@/stores/authStores";
import { useEffect, useState } from "react";
import { FaCalendar, FaCalendarCheck, FaHistory, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";

const COLORS = { present: "#322F81", late: "#a78bfa", absent: "#e879f9" };

export const Dashboard = () => {
  const user = useAuth((state) => state.user);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory().then(setRecords).finally(() => setLoading(false));
  }, []);

  const summary = {
    PRESENT: records.filter((r) => r.status === "PRESENT").length,
    LATE:    records.filter((r) => r.status === "LATE").length,
    ABSENT:  records.filter((r) => r.status === "ABSENT").length,
    TOTAL:   records.length,
  };

  const attendancePct = summary.TOTAL
    ? Math.round((summary.PRESENT / summary.TOTAL) * 100)
    : 0;

  // ── Donut data ──
  const donutData = [
    { name: "Present", value: summary.PRESENT, color: COLORS.present },
    { name: "Late",    value: summary.LATE,    color: COLORS.late    },
    { name: "Absent",  value: summary.ABSENT,  color: COLORS.absent  },
  ];

  // ── Monthly bar ──
  const monthlyMap: Record<string, { Present: number; Late: number; Absent: number }> = {};
  records.forEach((r) => {
    const m = new Date(r.date).toLocaleString("en-IN", { month: "short" });
    if (!monthlyMap[m]) monthlyMap[m] = { Present: 0, Late: 0, Absent: 0 };
    if (r.status === "PRESENT") monthlyMap[m].Present++;
    else if (r.status === "LATE") monthlyMap[m].Late++;
    else if (r.status === "ABSENT") monthlyMap[m].Absent++;
  });
  const barData = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  // ── Line — last 7 days ──
  const last7: { day: string; status: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const rec = records.find((r) => r.date === key);
    last7.push({
      day: d.toLocaleString("en-IN", { weekday: "short" }),
      status: rec?.status === "PRESENT" ? 1 : rec?.status === "LATE" ? 0.5 : 0,
    });
  }

  const displayName = user?.name
    ? user.name.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Student";

  const navCards = [
    { label: "Today",    path: "/attendance/today",    icon: FaCalendarCheck },
    { label: "Calendar", path: "/attendance/calendar", icon: FaCalendar      },
    { label: "History",  path: "/attendance/history",  icon: FaHistory       },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 space-y-5">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Dashboard</p>
          <h1 className="text-xl font-bold text-slate-800">
            Welcome back, <span style={{ color: "#322F81" }}>{displayName} 👋</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2">
          <FaUserCircle size={28} style={{ color: "#322F81" }} />
          <div>
            <p className="text-xs font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-400">{user?.email ?? "student"}</p>
          </div>
        </div>
      </div>

      {/* ── Row 1: Donut + Bar chart ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-sm font-semibold text-slate-700 mb-1">Data Overview</p>
          <p className="text-xs text-slate-400 mb-3">Your attendance breakdown</p>
          <div className="flex items-center gap-4">
            <div className="relative" style={{ width: 140, height: 140 }}>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                    {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-bold" style={{ color: "#322F81" }}>{attendancePct}%</p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-600">{d.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{loading ? "--" : d.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-1 border-t">
                <span className="text-slate-500">Total Days</span>
                <span className="font-bold text-slate-800">{loading ? "--" : summary.TOTAL}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <p className="text-sm font-semibold text-slate-700 mb-1">Monthly Overview</p>
          <p className="text-xs text-slate-400 mb-3">This year vs last year</p>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={barData} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="Present" fill="#322F81" radius={[4,4,0,0]} />
                <Bar dataKey="Late"    fill="#a78bfa" radius={[4,4,0,0]} />
                <Bar dataKey="Absent"  fill="#e879f9" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-400 text-center mt-10">No data yet</p>
          )}
        </div>
      </div>

      {/* ── Row 2: Stats cards + Line chart ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Stats 2x2 */}
        <div className="grid grid-cols-2 gap-3 md:col-span-1">
          {[
            { label: "Present",  value: summary.PRESENT, bg: "#322F81", text: "#fff"    },
            { label: "Late",     value: summary.LATE,    bg: "#a78bfa", text: "#fff"    },
            { label: "Absent",   value: summary.ABSENT,  bg: "#fce7f3", text: "#9d174d" },
            { label: "Total",    value: summary.TOTAL,   bg: "#ede9fe", text: "#322F81" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-1" style={{ background: s.bg }}>
              <p className="text-xs font-medium" style={{ color: s.text, opacity: 0.8 }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.text }}>{loading ? "--" : s.value}</p>
            </div>
          ))}
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border md:col-span-2">
          <p className="text-sm font-semibold text-slate-700 mb-1">Last 7 Days Trend</p>
          <p className="text-xs text-slate-400 mb-3">1 = Present · 0.5 = Late · 0 = Absent</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis domain={[0,1]} ticks={[0, 0.5, 1]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => v === 1 ? "Present" : v === 0.5 ? "Late" : "Absent"} />
              <Line
                type="monotone"
                dataKey="status"
                stroke="#322F81"
                strokeWidth={2.5}
                dot={{ fill: "#322F81", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Quick Nav ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {navCards.map((card) => (
          <button
            key={card.path}
            onClick={() => navigate(card.path)}
            className="bg-white border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition group"
          >
            <div className="p-3 rounded-xl group-hover:opacity-90 transition" style={{ background: "#322F81" }}>
              <card.icon size={18} color="#fff" />
            </div>
            <span className="font-semibold text-slate-700">{card.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;