"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Clock,
  Shield,
  Settings,
  LogOut,
  Package,
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserSession {
  email: string;
  token: string;
  loginTime: string;
}

export default function ProfilePage() {
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
  // 3. UI: Loading State
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-amber-200 rounded-full"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. UI: Not Logged In State
  // ==========================================
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-6">
        <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Access Denied
        </h2>
        <p className="text-slate-500 mb-6 text-center max-w-sm">
          We couldn't find your session data. Please log in to view your
          profile.
        </p>
        <Button
          onClick={() => router.push("/forms/login")}
          className="bg-amber-500 hover:bg-amber-600"
        >
          Go to Login
        </Button>
      </div>
    );
  }

  // ==========================================
  // 5. UI: Profile Data
  // ==========================================
  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* ===== PAGE HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <User className="h-8 w-8 text-amber-500" />
            My Profile
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your account settings and view your session details.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/settings")}
            className="gap-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50"
          >
            <Settings className="h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN: USER IDENTITY ===== */}
        <Card className="md:col-span-1 border-slate-200 shadow-sm flex flex-col items-center text-center p-6 h-fit">
          <div className="w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold border-4 border-white shadow-md">
            {userData.email.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-slate-900 w-full truncate px-2">
            {userData.email.split("@")[0]}
          </h2>
          <p className="text-slate-500 text-sm mb-4 truncate w-full px-2">
            {userData.email}
          </p>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 mb-6">
            Administrator
          </Badge>

          <div className="w-full border-t border-slate-100 pt-6 mt-auto">
            <Button
              variant="destructive"
              className="w-full gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-0"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </Card>

        {/* ===== RIGHT COLUMN: SESSION DETAILS ===== */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-400" /> Security & Session
              </CardTitle>
              <CardDescription>
                Details about your current active session.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Email Detail */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Registered Email
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Login Time */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Last Login Time
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {new Date(userData.loginTime).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "medium",
                    })}
                  </p>
                </div>
              </div>

              {/* Token Info */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-slate-500">
                  <Package className="h-5 w-5" />
                </div>
                <div className="w-full">
                  <p className="text-sm font-medium text-slate-500">
                    Active Token
                  </p>
                  <div className="mt-1 p-2 bg-slate-100 rounded text-xs font-mono text-slate-600 break-all">
                    {userData.token}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
