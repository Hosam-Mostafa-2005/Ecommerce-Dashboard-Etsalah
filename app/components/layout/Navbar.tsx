"use client";

import { useEffect, useState } from "react";
import { Search, Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

// تعريف نوع البيانات المتوقعة من الـ LocalStorage
interface UserSession {
  email: string;
  token: string;
  loginTime: string;
}

export default function Navbar() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // 1. Fetch Data from LocalStorage
  // ==========================================
  useEffect(() => {
    const session = localStorage.getItem("admin_session");

    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setUserData(parsedSession);
      } catch (error) {
        console.error("Failed to parse session data", error);
      }
    }

    setIsLoading(false);
  }, []);

  // ==========================================
  // 2. Logout Handler
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/forms/login");
  };

  // ==========================================
  // 3. Helper Functions
  // ==========================================
  // استخراج الاسم من الإيميل وعمل Capitalize لأول حرف
  const getDisplayName = (email: string) => {
    if (!email) return "User";
    const namePart = email.split("@")[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  };

  const displayName = userData ? getDisplayName(userData.email) : "Loading...";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* ================= LEFT: Sidebar Trigger & Logo ================= */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-md">
              <AvatarImage src="/images/logo.png" alt="logo" />
              <AvatarFallback className="bg-amber-100 text-amber-600 rounded-md font-bold">
                E
              </AvatarFallback>
            </Avatar>
            <Link
              href="/dashboard"
              className="hidden sm:block font-semibold text-slate-800 text-lg tracking-tight hover:text-amber-600 transition-colors"
            >
              Ecommerce Admin
            </Link>
          </div>
        </div>

        {/* ================= RIGHT: Notifications & Profile ================= */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 pl-2 pr-2 hover:bg-slate-100 rounded-full h-10"
                disabled={isLoading} // تعطيل الزر أثناء التحميل
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-bold leading-none text-slate-900">
                    {displayName}
                  </span>
                  <span className="text-xs text-slate-500 mt-1">Admin</span>
                </div>
                <Avatar className="h-8 w-8">
                  {/* إزالة الصورة الثابتة واستخدام الحرف الأول باللون البرتقالي */}
                  <AvatarFallback className="bg-amber-100 text-amber-700 font-bold">
                    {isLoading ? "" : initial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-1">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayName}
                  </p>
                  <p className="text-xs leading-none text-slate-500 truncate">
                    {userData?.email || "No email available"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/customers/profile">
                  <User className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4 text-slate-500" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
