"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Shield, Mail, Calendar, AlertCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/data"
import { PasswordChangeForm } from "@/components/password-change-form"
import { ProfileEditForm } from "@/components/profile-edit-form"

interface LocalUser {
  name: string
  email: string
  createdAt: string
  role: "Admin" | "User" | "Viewer"
  phoneNumber: string
  sendNotification: boolean
}

export function ProfileView() {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)
        let user: LocalUser = JSON.parse(localStorage.getItem("user_wvc")!)
        setUser(user)
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
        <h2 className="text-lg font-medium text-destructive">User Not Found</h2>
        <p className="mt-2 text-muted-foreground">There was an error loading your profile information.</p>
      </div>
    )
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return (
          <Badge className="bg-[#3a86fe]">
            <Shield className="mr-1 h-3 w-3" /> Admin
          </Badge>
        )
      case "User":
        return <Badge variant="outline">User</Badge>
      case "Viewer":
        return <Badge variant="secondary">Viewer</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24 border-2 border-border">
              <AvatarImage src={"/abstract-geometric-bj.png"} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                {getRoleBadge(user.role)}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-1 h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                Member since {user.createdAt.slice(0, 10)}
              </div>
              <div className="flex items-center text-muted-foreground">
                <AlertCircle className="mr-1 h-4 w-4" />
                {user.sendNotification ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>View and update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                    <p className="text-base">{user.name}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                    <p className="text-base">{user.email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                    <p className="text-base capitalize">{user.role}</p>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                    <p className="text-base">{user.phoneNumber}</p>
                  </div>
                </div>
             
              </div>

              <ProfileEditForm user={user} setUser={setUser} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
