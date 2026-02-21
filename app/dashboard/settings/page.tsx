"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Shield,
  AlertTriangle,
  Save,
  KeyRound,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // States لحفظ البيانات في الفورم
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // 1. جلب البيانات من الـ LocalStorage عند فتح الصفحة
  useEffect(() => {
    const sessionStr = localStorage.getItem("admin_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setEmail(session.email || "");
        // لو مفيش اسم كامل متسجل، هنستنتجه من الإيميل كقيمة مبدئية
        setFullName(session.fullName || session.email.split("@")[0] || "");
      } catch (error) {
        console.error("Error parsing session data", error);
      }
    }
  }, []);

  // 2. دالة حفظ بيانات الحساب
  const handleSaveAccount = () => {
    if (!email || !fullName) {
      toast.error("Validation Error", {
        description: "Name and Email are required.",
      });
      return;
    }

    setIsLoading(true);

    // محاكاة تأخير الشبكة (API)
    setTimeout(() => {
      // سحب الجلسة القديمة عشان نحافظ على الـ Token وباقي البيانات
      const sessionStr = localStorage.getItem("admin_session");
      const currentSession = sessionStr ? JSON.parse(sessionStr) : {};

      // تحديث البيانات
      const updatedSession = {
        ...currentSession,
        fullName: fullName,
        email: email,
      };

      // حفظ في LocalStorage
      localStorage.setItem("admin_session", JSON.stringify(updatedSession));

      // **إطلاق حدث (Event) مخصص عشان باقي المكونات تتحدث فوراً**
      window.dispatchEvent(new Event("sessionUpdated"));

      setIsLoading(false);
      toast.success("Account updated successfully", {
        description: "Your personal information has been saved.",
      });
    }, 1000);
  };

  const handleUpdatePassword = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password updated", {
        description: "Your new password has been set successfully.",
      });
    }, 1000);
  };

  const handleDeleteAccount = () => {
    toast.error("Account Deletion", {
      description: "Are you sure? This action cannot be undone.",
      action: {
        label: "Confirm Delete",
        onClick: () => {
          localStorage.removeItem("admin_session");
          window.dispatchEvent(new Event("sessionUpdated"));
          router.push("/forms/login");
          toast("Account deleted permanently.");
        },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* ===== PAGE HEADER ===== */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your account preferences, security, and personal information.
        </p>
      </div>

      <div className="grid gap-8">
        {/* ===== ACCOUNT SECTION ===== */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              {/* تعديل اللون ليتوافق مع البراند */}
              <User className="h-5 w-5 text-amber-500" /> Account Information
            </CardTitle>
            <CardDescription>
              Update your personal details and public profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Hosam Admin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-amber-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 px-6 flex justify-end">
            <Button
              onClick={handleSaveAccount}
              disabled={isLoading}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        {/* ===== SECURITY SECTION ===== */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-emerald-600" /> Security
            </CardTitle>
            <CardDescription>
              Ensure your account is using a long, random password to stay
              secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                className="focus-visible:ring-amber-500"
              />
            </div>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="focus-visible:ring-amber-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Password must be at least 8 characters long.
              </p>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 px-6 flex justify-end">
            <Button
              onClick={handleUpdatePassword}
              disabled={isLoading}
              variant="outline"
              className="gap-2 text-slate-700 hover:text-amber-600 hover:bg-amber-50 border-slate-200"
            >
              <KeyRound className="h-4 w-4" /> Update Password
            </Button>
          </CardFooter>
        </Card>

        {/* ===== DANGER ZONE ===== */}
        <Card className="border-red-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-red-600">
              <AlertTriangle className="h-5 w-5" /> Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Once your account is deleted, all of its resources and data will
              be permanently deleted. Before deleting your account, please
              download any data or information that you wish to retain.
            </p>
          </CardContent>
          <CardFooter className="bg-red-50/50 border-t border-red-100 py-4 px-6">
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete Account
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
