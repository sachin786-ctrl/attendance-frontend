import { FaCalendar, FaCalendarCheck, FaHistory } from 'react-icons/fa';
import { FiSettings, FiUsers } from 'react-icons/fi';
import { HiOutlineClipboardCheck } from 'react-icons/hi';
import { SlHome } from 'react-icons/sl';


export const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: SlHome },

  { name: "Profile", path: "/profile", icon: FiUsers },

  { name: "Attendance", path: "/attendance", icon: HiOutlineClipboardCheck },
 
  { name: "Today Attendance",  path: "/attendance/today",    icon: FaCalendarCheck },
  { name: "Calendar",          path: "/attendance/calendar", icon: FaCalendar },
  { name: "History",           path: "/attendance/history",  icon: FaHistory },
  
  { name: "Settings", path: "/settings", icon: FiSettings },
  
];

 