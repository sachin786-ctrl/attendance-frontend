export interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "PRESENT" | "LATE" | "ABSENT";
  totalHours: number; // minutes mein
}