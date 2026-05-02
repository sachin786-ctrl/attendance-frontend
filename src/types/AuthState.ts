import type { LoginData } from "../models/LoginData";
import type { LoginResponseData } from "../models/LoginResponseData";
import type { User } from "../models/User";

export type AuthState = {
  accessToken: string | null;
  user: User | null;
  authStatus: boolean;
  authLoading: boolean;

  login: (loginData: LoginData) => Promise<LoginResponseData>;  // ✅ async = Promise<LoginResponseData>
  logout: (silent?: boolean) => Promise<void>;  // ✅ async = Promise<void>
  checkLogin: () => boolean;                    // ✅ always returns boolean
  deleteAccount: () => Promise<void>;          // ✅ async = Promise<void>

  changeLocalLoginData: (
    accessToken: string,
    user: User,
    authStatus: boolean
  ) => void;
};