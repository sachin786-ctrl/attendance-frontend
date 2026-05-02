import { HiOutlineViewBoards } from "react-icons/hi";
import { LuClipboardList } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi";
import type { IconType } from "react-icons/lib";

export type Stat = {
  title: string;
  value: number;
  icon: IconType;
  color: string;
};

export const stats: Stat[] = [
  {
    title: "Sections",
    value: 8,
    icon: HiOutlineViewBoards,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Fields",
    value: 6,
    icon: LuClipboardList,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Users",
    value: 1,
    icon: HiOutlineUsers,
    color: "bg-violet-50 text-violet-600",
  },
];

//image array for logo
export const logoImages = [
  "src/assets/Untitled design.png",
];  