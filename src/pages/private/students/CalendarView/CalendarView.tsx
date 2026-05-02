import useAuth from '@/stores/authStores';
import React, { useEffect, useState } from 'react'
import { getMonthly } from '@/service/authService';
import type { AttendanceRecord } from '@/models/Attendance';

const CalendarView = () => {
  const user = useAuth((state) => state.user);
 const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthly();
  }, [month, year]);

  const fetchMonthly = async () => {
    setLoading(true);
    try {
      const data = await getMonthly(month, year);
      setRecords(data);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (m: number, y: number) =>
    new Date(y, m, 0).getDate();

  const getFirstDay = (m: number, y: number) =>
    new Date(y, m - 1, 1).getDay();

  const getStatusForDate = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return records.find((r) => r.date === dateStr)?.status ?? null;
  };

  const statusStyle = {
    PRESENT: "bg-green-500 text-white",
    LATE: "bg-yellow-400 text-white",
    ABSENT: "bg-red-400 text-white",
  };

  const summary = {
    PRESENT: records.filter((r) => r.status === "PRESENT").length,
    LATE: records.filter((r) => r.status === "LATE").length,
    ABSENT: records.filter((r) => r.status === "ABSENT").length,
  };

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const days = getDaysInMonth(month, year);
  const firstDay = getFirstDay(month, year);
  const monthName = new Date(year, month - 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">CalendarView</h2>
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

      <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6 space-y-6">

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg">←</button>
          <h2 className="font-semibold text-slate-800">{monthName}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg">→</button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.PRESENT}</p>
            <p className="text-xs text-slate-500">Present</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{summary.LATE}</p>
            <p className="text-xs text-slate-500">Late</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-red-500">{summary.ABSENT}</p>
            <p className="text-xs text-slate-500">Absent</p>
          </div>
        </div>

        {/* Calendar Grid */}
        {loading ? <p className="text-center text-slate-500">Loading...</p> : (
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} className="text-center text-xs text-slate-400 font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const status = getStatusForDate(day);
                const isToday = day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
                return (
                  <div
                    key={day}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-sm font-medium
                      ${status ? statusStyle[status] : "text-slate-700"}
                      ${isToday && !status ? "border-2 border-[#322F81]" : ""}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-4 justify-center text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"/> Present</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"/> Late</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"/> Absent</span>
        </div>
      </div>
    </div>
    </div>
  );
};
export default CalendarView

