 
import { refreshToken } from "@/service/authService";
import useAuth from "@/stores/authStores";
import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

//every request: before
instance.interceptors.request.use((config) => {
  const accessToken = useAuth.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let pending: any[] = [];

function queueRequest(cb: any) {
  pending.push(cb);
}

function resolveQueue(newToken: string) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const is401 = error.response.status === 401;
    const original = error.config;

    // ✅ Login ya refresh endpoint pe 401 aaye to seedha toast dikhaao, refresh mat karo
    if (original.url?.includes("/auth/login") || original.url?.includes("/auth/refresh")) {
      toast.error(error.response.data?.message || "Invalid credentials");
      return Promise.reject(error);
    }

    if (!is401 || original._retry) {
      if (error.response && error.response.data)
        toast.error(error.response.data?.message || "An error occurred");
      return Promise.reject(error);
    }

    // baaki refresh logic same rahega...

    original._retry = true;
    //we will try to refresh the token:
    if (isRefreshing) {
      // console.log("added to queue");
      return new Promise((resolve, reject) => {
        queueRequest((newToken: string) => {
          if (!newToken) return reject();
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(instance(original));
        });
      });
    }

    //start refresh
    isRefreshing = true;

    try {
      // console.log("start refreshing...");
      const loginResponse = await refreshToken();
      const newToken = loginResponse.accessToken;
      if (!newToken) throw new Error("no access token received");
      useAuth
        .getState()
        .changeLocalLoginData(
          loginResponse.accessToken,
          loginResponse.user,
          true
        );
      //
      resolveQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return instance(original);
    } catch (error) {
      resolveQueue("null");
      useAuth.getState().logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
