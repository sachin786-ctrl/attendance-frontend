export interface AttendanceRecord {  // Attendance → AttendanceRecord
  id: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: "PRESENT" | "LATE" | "ABSENT";
}