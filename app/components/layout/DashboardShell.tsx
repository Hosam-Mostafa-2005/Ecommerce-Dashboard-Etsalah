import React from "react";
import Navbar from "./Navbar";
import SidebarPage from "./Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex-1 text-gray-900 flex">
        {/* Sidebar */}
        <SidebarPage />

        {/* Right side = navbar + content */}
        <SidebarInset>
          <div className="flex-1 flex flex-col">
            {/* Navbar full width of remaining space */}
            <Navbar />

            {/* Content expands fully */}
            <main className="flex-1 overflow-auto px-6 py-6">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
