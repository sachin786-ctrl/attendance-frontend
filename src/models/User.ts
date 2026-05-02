// types/user.ts

export type UserRole = "USER" | "ADMIN" | "GUEST";

export interface User {
  id: string;
  name: string;
  email: string;
  enable: boolean;
  image?: string;
  provider?: string;
  roles: UserRole[];
  createdAt: string;   // API se string aata hai
  updatedAt: string;
}