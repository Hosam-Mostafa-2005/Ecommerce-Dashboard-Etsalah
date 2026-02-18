"use client";

import { useState } from "react";
import Link from "next/link";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Home,
  Calendar,
  Users,
  BarChart2,
  PlusCircle,
  HelpCircle,
  Settings,
  ListOrdered,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import orders from "../../mocks/data/orders.json";

export type SidebarItem = {
  id: string;
  title: string;
  href: string;
  icon: any;
  badge?: number | string;
  children?: SidebarItem[];
};

export default function SidebarPage() {
  /* ================= MENU DATA ================= */

  const mainItems: SidebarItem[] = [
    { id: "home", title: "Dashboard", href: "/dashboard", icon: Home },
    { id: "calendar", title: "Schedule", href: "/calendar", icon: Calendar },
  ];

  const managementItems: SidebarItem[] = [
    {
      id: "products",
      title: "Products",
      href: "/dashboard/products",
      icon: PlusCircle,
    },
    {
      id: "customers",
      title: "Customers",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      id: "orders",
      title: "Orders",
      href: "/dashboard/orders",
      icon: ListOrdered,
      badge: orders.length,
    },

    /* ===== ANALYTICS WITH CHILDREN ===== */
    {
      id: "analytics",
      title: "Analytics",
      href: "#",
      icon: BarChart2,
      children: [
        {
          id: "analytics-overview",
          title: "Overview",
          href: "/dashboard/reports",
          icon: BarChart2,
        },
        {
          id: "analytics-sales",
          title: "Sales Charts",
          href: "/dashboard/reports/sales",
          icon: BarChart2,
        },
        {
          id: "analytics-customers",
          title: "Customer Insights",
          href: "/dashboard/reports/customers",
          icon: Users,
        },
        {
          id: "analytics-revenue",
          title: "Revenue",
          href: "/dashboard/reports/revenue",
          icon: BarChart2,
        },
      ],
    },
  ];

  const configItems: SidebarItem[] = [
    { id: "settings", title: "Settings", href: "/settings", icon: Settings },
    { id: "help", title: "Help & Support", href: "/help", icon: HelpCircle },
  ];

  /* ================= OPEN STATE ================= */

  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= RENDER FUNCTION ================= */

  const renderSidebarItems = (items: SidebarItem[]) => (
    <SidebarMenu>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openItems[item.id];

        return (
          <SidebarMenuItem key={item.id} className="ml-3">
            {/* ===== MAIN ITEM ===== */}
            <SidebarMenuButton
              asChild={!hasChildren}
              onClick={() => hasChildren && toggleItem(item.id)}
            >
              {hasChildren ? (
                <div className="flex items-center justify-between w-full cursor-pointer">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-orange-500" />
                    <span>{item.title}</span>
                  </div>

                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="flex justify-between items-center w-full"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-orange-500" />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </SidebarMenuButton>

            {/* ===== CHILDREN ===== */}
            {hasChildren && isOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {item.children!.map((child) => (
                  <Link
                    key={child.id}
                    href={child.href}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-black py-1"
                  >
                    <child.icon className="w-4 h-4" />
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  /* ================= UI ================= */

  return (
    <Sidebar collapsible="offcanvas" className="flex flex-col h-full">
      <SidebarContent className="flex-1 mt-3">
        {/* BRAND */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-3 px-4 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/images/logo.png" />
            </Avatar>
            <span className="text-lg font-bold text-gray-800">Etsalah</span>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* MAIN */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-xs px-4 text-gray-500">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderSidebarItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* MANAGEMENT */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="uppercase text-xs px-4 text-gray-500">
            E-commerce
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderSidebarItems(managementItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SETTINGS */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="uppercase text-xs px-4 text-gray-500">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderSidebarItems(configItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
