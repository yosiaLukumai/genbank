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
import { useEffect, useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["Admin", "User", "Viewer"],
  },
  {
    title: "Freezers",
    href: "/dashboard/fridges",
    icon: Thermometer,
    allowedRoles: ["Admin", "User", "Viewer"],
  },
  {
    title: "Add Freezer",
    href: "/dashboard/fridges/new",
    icon: PlusCircle,
    allowedRoles: ["Admin", "User"],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    allowedRoles: ["Admin"],
  },
  {
    title: "Add User",
    href: "/dashboard/users/new",
    icon: User,
    allowedRoles: ["Admin"],
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: ClipboardList,
    allowedRoles: ["Admin", "User", "Viewer"],
  },
  {
    title: "My Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
    allowedRoles: ["Admin", "User", "Viewer"],
  },
]


interface NavItem {
  title: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}





interface LocalUser {
  name: string;
  email: string;
  createdAt: string;
  role: "Admin" | "User" | "Viewer";
}


function filterNavItems(items: typeof navItems, userRole: LocalUser["role"]) {
  return items.filter((item) => item.allowedRoles?.includes(userRole));
}

export function Sidebar() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<LocalUser | null>(null)
  const [navs, setNavs] = useState<NavItem[]>([])
   const router = useRouter()


   useEffect(() => {
     async function loadUser() {
       try {
         setLoading(true);
         let user: LocalUser = JSON.parse(localStorage.getItem("user_wvc")!);
         setUser(user);
         // using role to determine which nav items to show
         const filteredNavItems = filterNavItems(navItems, user.role);
         setNavs(filteredNavItems);
       } catch (error) {
         console.error("Error loading user data:", error);
       } finally {
         setLoading(false);
       }
     }
 
     loadUser();
   }, []);

  const logoutUser = () => {
    localStorage.removeItem("user");
    document.cookie = "authenticated_user_wvc=; path=/; max-age=0";
    router.push("/");
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-green-800 text-white md:w-64 z-10">
      <div className="flex h-16 items-center justify-center border-b border-green-600 p-2">
        <div className="flex items-center gap-2">
          <Snowflake className="h-8 w-8 text-white" />
          <span className="hidden text-xl font-bold md:block">GENEBANK</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navs.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              pathname === item.href ? "bg-green-600 text-white" : "text-gray-300 hover:bg-green-600 hover:text-white",
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
          className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-300 transition-colors hover:bg-green-700 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline-block">Logout</span>
        </Button>
      </div>
    </div>
  )
}
