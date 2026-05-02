 // all apis are here
 
 // ✅ Signup API
import instance from "@/config/instance";
import type { Attendance } from "@/models/Attendance";
import type { LoginData } from "@/models/LoginData";
import type { LoginResponseData } from "@/models/LoginResponseData";
import type { SignupData } from "@/models/SignupData";
import type { User } from "@/models/User";

  // Signup API
export const registerUser = async (data: SignupData) => {
    const response = await instance.post("/auth/register", data);
    return response.data;
};
  
  // Login API
export const loginUser = async (data: LoginData) => {
    const response = await instance.post("/auth/login", data);

    // Token store
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  };
export const logoutUser = async () => {
  const response = await instance.post(`/auth/logout`);
  return response.data;
};
// Update user (name only)
export const updateUser = async (data: { name: string }, id: string | undefined) => {
  const response = await instance.patch(`/users/${id}`, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id: string | undefined) => {
  const response = await instance.delete(`/users/${id}`);
  return response.data;
};

// Update user image (send as URL string or base64)
export const updateUserImage = async (image: string, id: string | undefined) => {
  const response = await instance.patch(`/users/${id}`, { image });
  return response.data;
};


//get current login user
export const getCurrentUser = async (emailId: string | undefined) => {
  const response = await instance.get<User>(`/users/email/${emailId}`);
  return response.data;
};

//refresh token

export const refreshToken = async () => {
  const response = await instance.post<LoginResponseData>(`/auth/refresh`);
  return response.data;
};

export const checkIn = async () => {
  const response = await instance.post<Attendance>("/attendance/check-in");
  return response.data;
};

export const checkOut = async () => {
  const response = await instance.post<Attendance>("/attendance/check-out");
  return response.data;
};

export const getToday = async () => {
  const response = await instance.get<Attendance>("/attendance/today");
  return response.data;
};

export const getHistory = async () => {
  const response = await instance.get<Attendance[]>("/attendance/history");
  return response.data;
};

export const getMonthly = async (month: number, year: number) => {
  const response = await instance.get<Attendance[]>("/attendance/monthly", {
    params: { month, year },
  });
  return response.data;
};

//apis
