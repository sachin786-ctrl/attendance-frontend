import useAuth from '@/stores/authStores';
import React, { useEffect, useState } from 'react'
import type Attendance from '../Attendance/Attendance';
import { getHistory } from '@/service/authService';

const Projects = () => {
  const user = useAuth((state) => state.user);
    const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then(setRecords).finally(() => setLoading(false));
  }, []);

  const formatTime = (t: string | null) => t ? t.substring(0, 5) : "--:--";
  const formatHours = (m: number) => `${Math.floor(m/60)}h ${m%60}m`;

  const statusStyle = {
    PRESENT: "text-green-600 bg-green-100",
    LATE: "text-yellow-600 bg-yellow-100",
    ABSENT: "text-red-600 bg-red-100",
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Projects</h2>
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

      <div className="max-w-4xl mx-auto bg-white border rounded-2xl p-6">
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-center text-slate-500">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-slate-500 text-left">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Clock in</th>
                  <th className="pb-3 pr-4">Clock out</th>
                  <th className="pb-3 pr-4">Total Hours</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3 pr-4 text-slate-700">{r.date}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatTime(r.checkIn)}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatTime(r.checkOut)}</td>
                    <td className="py-3 pr-4 text-slate-700">
                      {r.checkOut ? formatHours(r.totalHours) : "--"}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Projects