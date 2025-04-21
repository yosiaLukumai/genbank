"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Shield } from "lucide-react"
import { getUsers } from "@/lib/data"
import { config } from "@/config/config"
import { toast } from "sonner"
import { DeleteResourceDialog } from "./confirmdelete"



interface User{
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Viewer" | "User";
  createdAt: string;
}

export function UsersList() {
  const [usersList, setUsersList] = useState<User[]>([])
  const [use, setUser] = useState<User | null>(null)
  const [deleteUser, setdeleteUser] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState("")
  const [reload, setReload] = useState(false)


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await fetch(`${config.api.baseUrl}/users/all`)
        let jsonResponse = await response.json()
        if(jsonResponse.success) {
          setUsersList(jsonResponse.body);
        }else {
          toast.error("Error Fetching Users", {
            description: "Failed to fetch users"
          })
        }
      } catch (error) {
        toast.error("Error Fetching Users", {
          description: "Failed to fetch users"
        })
      }
    }

    async function loadUser() {
      try {
        let user: User = JSON.parse(localStorage.getItem("user_wvc")!)
        setUser(user)
      } catch (error) {
        console.error("Error loading user data:", error)
      } 
    }

    fetchUsers()
    loadUser()
  }, [reload])

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

  const handleDelete = (id: string) => {
    setdeleteUser(true)
    setDeleteUserId(id)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {usersList.map((user) => (
        <Card key={user._id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={"/abstract-geometric-bj.png"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.name}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuItem asChild>
                    <Link href={`/dashboard/users/${user._id}`}>View Profile</Link>
                  </DropdownMenuItem> */}
                  {use?.role === "Admin" && 
                     <DropdownMenuItem asChild>
                     <Link href={`/dashboard/users/${user._id}/edit`}>Edit</Link>
                   </DropdownMenuItem>
                  }
                  {
                    use?.role === "Admin" && <DropdownMenuItem onClick={() => handleDelete(user._id)}>Delete</DropdownMenuItem>
                  }
               
                
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            {getRoleBadge(user.role)}
            {/* <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/users/${user._id}`}>View Profile</Link>
            </Button> */}
          </CardFooter>
        </Card>
      ))}

      <DeleteResourceDialog resourceName="Delete User"  isOpen={deleteUser} onClose={() => {setdeleteUser(false), setReload(!reload)}} apiEndpoint={`/users/delete`} resourceId={deleteUserId} onSuccess={() => {setdeleteUser(false), setReload(!reload)}} />

    </div>
  )
}
