import "./App.css";
import { useEffect } from "react";
import { PublicRoute } from "./layouts/PublicLayout";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/public/home/Home";
import Services from "./pages/public/features/Services";
import About from "./pages/public/features/About";
import Contact from "./pages/public/features/Contact";
import PrivateRoute from "./layouts/PrivateLayout";
import Profile from "./pages/private/students/profile/Profile";
import { Dashboard } from "./pages/private/students/dashboard/Dashboard";

import useAuth from "./stores/authStores";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import OauthSuccess from "./pages/private/oauth2/OauthSuccess";
import Settings from "./pages/private/students/settings/Settings";
import TodayAttendance from "./pages/private/students/todayAttendance/TodayAttendance";
import CalendarView from "./pages/private/students/calendarView/CalendarView";
import Attendance from "./pages/private/students/attendance/Attendance";
import HistoryTable from "./pages/private/students/historyTable/HistoryTable";

const App = () => {
  const checkLogin = useAuth((state) => state.checkLogin);

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes — redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="aouth/success" element={<OauthSuccess/>} />

        
        </Route>

        {/* Private Routes — redirect to login if not logged in */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/today" element={<TodayAttendance />} />
          <Route path="/attendance/calendar" element={<CalendarView />} />
          <Route path="/attendance/history" element={<HistoryTable />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
