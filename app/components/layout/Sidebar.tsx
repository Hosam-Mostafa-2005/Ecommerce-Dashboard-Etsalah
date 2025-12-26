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
  Inbox,
  Calendar,
  Users,
  Box,
  BarChart2,
  PlusCircle,
  HelpCircle,
  Settings,
  ListOrdered,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import orders from "../../mocks/data/orders.json";

export type SidebarItem = {
  id: string;
  title: string;
  href: string;
  icon: any;
  badge?: number | string;
  children?: SidebarItem[];
  external?: boolean;
};

const SidebarPage = () => {
  const mainItems: SidebarItem[] = [
    { id: "home", title: "Dashboard", href: "/dashboard", icon: Home },
    // { id: "orders", title: "Orders", href: "/orders", icon: Box, },
    // { id: "inbox", title: "Inbox", href: "/inbox", icon: Inbox, badge: 3 },
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
      badge: `${orders.length}`,
    },
    {
      id: "reports",
      title: "Analytics",
      href: "/dashboard/reports",
      icon: BarChart2,
    },
  ];

  const configItems: SidebarItem[] = [
    { id: "settings", title: "Settings", href: "/settings", icon: Settings },
    { id: "help", title: "Help & Support", href: "/help", icon: HelpCircle },
  ];

  // const isCollapsed = false;

  const renderSidebarItems = (items: SidebarItem[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id} className="group ml-4">
          <SidebarMenuButton asChild>
            <Link
              href={item.href}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-6 h-6 text-orange-500" />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {item.badge}
                </span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="offcanvas" className="flex flex-col h-full">
      <SidebarContent className="flex-1 mt-3">
        {/*
          ========== 1. قسم الشعار والتصغير (Branding Header) ========== 
        */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-4 mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/images/logo.png" />
              </Avatar>
              <span className="text-lg font-bold text-gray-800">Etsalah</span>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>

        {/*
          ========== 2. قسم التنقل الأساسي (Main Navigation) ========== 
        */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="uppercase text-xs font-semibold text-gray-500 px-4">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderSidebarItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/*
          ========== 3. قسم الإدارة والتحليلات (Management) ========== 
        */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="uppercase text-xs font-semibold text-gray-500 px-4">
            E-commerce
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderSidebarItems(managementItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/*
          ========== 4. قسم الإعدادات (Configuration) ========== 
        */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="uppercase text-xs font-semibold text-gray-500 px-4">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderSidebarItems(configItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarPage;
