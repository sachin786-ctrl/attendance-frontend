import { deleteUser, loginUser, logoutUser } from "@/service/authService";
import type { AuthState } from "@/types/AuthState";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const LOCAL_KEY = "app_state";

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      authStatus: false,
      authLoading: false,

      // 🔐 LOGIN
      login: async (loginData) => {
        set({ authLoading: true });
        try {
          const res = await loginUser(loginData);
          set({
            accessToken: res.accessToken,
            user: res.user,
            authStatus: true,
          });
          return res;
        } finally {
          // ✅ No catch needed — error bubbles up naturally, finally always runs
          set({ authLoading: false });
        }
      },

      // 🚪 LOGOUT
      logout: async (silent = false) => {
        set({ authLoading: true });
        try {
          await logoutUser();
          toast.success("Logout successful!");
        } catch (error) {
          // ✅ Log error but always complete logout
          console.error("Logout API error:", error);
        } finally {
          // ✅ Single place to reset — always runs
          set({
            accessToken: null,
            user: null,
            authStatus: false,
            authLoading: false,
          });
        }
      },

      // delet acount
      deleteAccount: async () => {
        set({ authLoading: true });

        try {
          const userId = get().user?.id;

          if (!userId) {
            toast.error("User ID not found!");
            return;
          }

          await deleteUser(userId);

          // ✅ flag set
          localStorage.setItem("accountDeleted", "true");

          set({
            accessToken: null,
            user: null,
            authStatus: false,
          });
        } catch (error) {
          console.error("Account deletion error:", error);
          toast.error("Account deletion failed!");
        } finally {
          set({ authLoading: false });
        }
      },
      // 🔍 CHECK LOGIN
      checkLogin: () => {
        const { accessToken, authStatus } = get();
        // ✅ return false explicitly (was missing before)
        return !!(accessToken && authStatus);
      },

      // 🔄 MANUAL UPDATE
      changeLocalLoginData: (accessToken, user, authStatus) => {
        set({ accessToken, user, authStatus });
      },
    }),

    { name: LOCAL_KEY },
  ),
);

export default useAuth;
