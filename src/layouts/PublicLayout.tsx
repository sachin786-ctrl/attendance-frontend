import Footer from "@/pages/public/comman/Footer";
import Navbar from "@/pages/public/comman/Navbar";
import useAuth from "@/stores/authStores";
import { Toaster } from "react-hot-toast";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
  const authStatus = useAuth((state) => state.authStatus);

  if (authStatus) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "14px",
            borderRadius: "0px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
          success: {
            iconTheme: { primary: "#7c3aed", secondary: "#fff" },
          },
        }}
      />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};