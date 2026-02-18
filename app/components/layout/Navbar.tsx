import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b shadow-sm w-full bg-gray-50">
      <div className="h-16 flex items-center px-6 gap-4">
        {/* left: menu (mobile) + logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger>
            <Button variant="ghost" className="p-2">
              <Menu className="w-5 h-5 text-black" />
            </Button>
          </SidebarTrigger>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-md font-bold">
              <Avatar>
                <AvatarImage src="/images/logo.png" alt="logo" />
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
            </div>
            <span className="hidden sm:block font-semibold text-gray-800">
              <Link href="/dashboard">Ecommerce Admin</Link>
            </span>
          </div>
        </div>

        <div className="flex-1 px-4">
          <div className="hidden md:block">
            <Input
              placeholder="Search products..."
              className="w-64 float-right"
            />
          </div>
        </div>

        {/* right: actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="p-2 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">Hosam</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
                <Avatar>
                  <AvatarImage src="/images/avatar.png" alt="Hosam" />
                  <AvatarFallback>H</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/dashboard/customers/:id">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {" "}
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
