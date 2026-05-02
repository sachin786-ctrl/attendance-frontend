import { checkIn, checkOut, getToday } from '@/service/authService';
import useAuth from '@/stores/authStores';
import React, { useEffect, useState, useRef } from 'react'
import { FaClock, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import type Attendance from '../Attendance/Attendance';
import type { AttendanceRecord } from '@/models/Attendance';

const TodayAttendance = () => {
  const user = useAuth((state) => state.user);

  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Timer state ──
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ==================== TIMER LOGIC ====================

  // checkIn time se ab tak kitne seconds gaye — calculate karo
  const calcElapsed = (checkInTime: string): number => {
    const today = new Date().toISOString().split("T")[0]; // "2024-01-15"
    const checkInDate = new Date(`${today}T${checkInTime}`);
    return Math.floor((Date.now() - checkInDate.getTime()) / 1000);
  };

  // Timer start karo
  const startTimer = (checkInTime: string) => {
    // Pehle se running timer clear karo
    if (timerRef.current) clearInterval(timerRef.current);

    // Starting point set karo — ab tak kitna time ja chuka hai
    setElapsedSeconds(calcElapsed(checkInTime));

    // Har second update karo
    timerRef.current = setInterval(() => {
      setElapsedSeconds(calcElapsed(checkInTime));
    }, 1000);
  };

  // Timer band karo
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Component unmount pe timer clear karo (memory leak avoid)
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // Attendance fetch hone ke baad timer handle karo
  useEffect(() => {
    if (!attendance) return;

    if (attendance.checkIn && !attendance.checkOut) {
      // Checked in hai, checkout nahi — timer chalao
      startTimer(attendance.checkIn);
    } else if (attendance.checkIn && attendance.checkOut) {
      // Dono ho gaye — timer band karo, final time set karo
      stopTimer();
      const today = new Date().toISOString().split("T")[0];
      const inTime  = new Date(`${today}T${attendance.checkIn}`);
      const outTime = new Date(`${today}T${attendance.checkOut}`);
      setElapsedSeconds(Math.floor((outTime.getTime() - inTime.getTime()) / 1000));
    }
  }, [attendance]);

  // ==================== FORMAT HELPERS ====================

  // Seconds → "HH:MM:SS"
  const formatTimer = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const formatTime = (time: string | null) =>
    time ? time.substring(0, 5) : "--:--";

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // ==================== DATA FETCH ====================

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const data = await getToday();
      setAttendance(data);
    } catch {
      setAttendance(null);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLERS ====================

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const data = await checkIn();
      setAttendance(data);
      toast.success("Check-in successful!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Check-in failed!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const data = await checkOut();
      setAttendance(data);
      toast.success("Check-out successful!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Check-out failed!");
    } finally {
      setActionLoading(false);
    }
  };

  // ==================== STATUS COLORS ====================

  const statusColor: Record<string, string> = {
    PRESENT: "text-green-600 bg-green-100",
    LATE:    "text-yellow-600 bg-yellow-100",
    ABSENT:  "text-red-600 bg-red-100",
  };

  if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

  // ==================== RENDER ====================

  const isCheckedIn  = !!attendance?.checkIn;
  const isCheckedOut = !!attendance?.checkOut;
  const timerRunning = isCheckedIn && !isCheckedOut;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Today's Attendance</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Welcome,{" "}
          {user?.name
            ? user.name
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : ""}
        </p>
      </div>

      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 space-y-6">

          {/* Date */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year:    "numeric",
                month:   "long",
                day:     "numeric",
              })}
            </p>
          </div>

          {/* Status badge */}
          <div className="text-center">
            {attendance ? (
              <span className={`px-4 py-1 rounded-full text-sm font-semibold ${statusColor[attendance.status]}`}>
                {attendance.status}
              </span>
            ) : (
              <span className="px-4 py-1 rounded-full text-sm font-semibold text-slate-600 bg-slate-100">
                NOT MARKED
              </span>
            )}
          </div>

          {/* Clock in / Timer / Clock out */}
          <div className="grid grid-cols-3  gap-4">

            {/* Clock In */}
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Clock in</p>
              <p className="text-xl font-bold text-slate-800">
                {formatTime(attendance?.checkIn ?? null)}
              </p>
            </div>

            {/* Live Timer */}
            <div className={`rounded-xl p-4 text-center transition-colors duration-300
              ${timerRunning
                ? "bg-green-50 border border-green-200"   // chalu — green
                : isCheckedOut
                  ? "bg-blue-50 border border-blue-200"   // complete — blue
                  : "bg-slate-50"                          // abhi shuru nahi
              }`}
            >
              <p className="text-xs text-slate-500 mb-1">
                {timerRunning ? "Time elapsed" : isCheckedOut ? "Total time" : "Duration"}
              </p>
              <p className={`text-xl font-bold font-mono
                ${timerRunning  ? "text-green-700" : "text-slate-800"}`}
              >
                {isCheckedIn ? formatTimer(elapsedSeconds) : "--:--:--"}
              </p>
              {/* Blinking dot — timer chal raha hai tab */}
              {timerRunning && (
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-1 animate-pulse" />
              )}
            </div>

            {/* Clock Out */}
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Clock out</p>
              <p className="text-xl font-bold text-slate-800">
                {formatTime(attendance?.checkOut ?? null)}
              </p>
            </div>

       
          </div>
               {/* Total Hours (backend se — checkout ke baad) */}
            {isCheckedOut && attendance?.totalHours !== undefined && (
              <div className="bg-green-50 border border-green-200 grid grid-cols-1 items-center justify-items-center rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Total Hours</p>
                <p className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                  <FaClock /> {formatHours(attendance.totalHours)}
                </p>
              </div>
            )}

          {/* Action Button */}
          <div>
            {!attendance ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="w-full bg-[#322F81] hover:bg-[#1E1B4B] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <FaSignInAlt /> {actionLoading ? "Please wait..." : "Clock in"}
              </button>
            ) : !attendance.checkOut ? (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <FaSignOutAlt /> {actionLoading ? "Please wait..." : "Clock out"}
              </button>
            ) : (
              <div className="text-center text-slate-500 text-sm py-3">
                ✅ Attendance complete for today!
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TodayAttendance;