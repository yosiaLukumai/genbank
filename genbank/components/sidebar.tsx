"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Thermometer,
  Users,
  ClipboardList,
  LogOut,
  PlusCircle,
  User,
  LayoutDashboard,
  Snowflake,
  UserCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Fridges",
    href: "/dashboard/fridges",
    icon: Thermometer,
  },
  {
    title: "Add Fridge",
    href: "/dashboard/fridges/new",
    icon: PlusCircle,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Add User",
    href: "/dashboard/users/new",
    icon: User,
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: ClipboardList,
  },
  {
    title: "My Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
]

export function Sidebar() {
  const pathname = usePathname()
   const router = useRouter()


  const logoutUser = () => {
    localStorage.removeItem("user");
    document.cookie = "authenticated_user_wvc=; path=/; max-age=0";
    router.push("/");
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-[#121212] text-white md:w-64 z-10">
      <div className="flex h-16 items-center justify-center border-b border-gray-800 p-2">
        <div className="flex items-center gap-2">
          <Snowflake className="h-8 w-8 text-white" />
          <span className="hidden text-xl font-bold md:block">GENBANK</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              pathname === item.href ? "bg-[#3a86fe] text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="hidden md:inline-block">{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-2">
        <Button
          variant="ghost"
          onClick={() => logoutUser()}
          className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline-block">Logout</span>
        </Button>
      </div>
    </div>
  )
}
