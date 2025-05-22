"use client"
import { FridgesList } from "@/components/fridges-list"
import { PageHeader } from "@/components/page-header"
import { useEffect, useState } from "react"


interface LocalUser {
  name: string
  email: string
  createdAt: string
  role: "Admin" | "User" | "Viewer"
}

export default function FridgesPage() {
  const [user, setUser] = useState<LocalUser | null>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        let user: LocalUser = JSON.parse(localStorage.getItem("user_wvc")!);
        setUser(user);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Freezers"
        description="Manage your coldroom freezer"
        action={(user?.role === "Admin" || user?.role == "User") ? { label: "Add Freezer", href: "/dashboard/fridges/new" } : undefined}
      />
      <FridgesList />
    </div>
  )
}
