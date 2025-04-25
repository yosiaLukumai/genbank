"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { config } from "@/config/config"
import { Checkbox } from "./ui/checkbox"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  role: z.enum(["Admin", "User", "Viewer"], {
    required_error: "Please select a role.",
  }),
  sendNotification: z.enum(["Yes", "No"], {
    required_error: "Please select Notification Preference.",
  }),
  phoneNumber: z.string().optional(),
})

export function AddUserForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "User",
      phoneNumber: "",
      sendNotification: "No",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {


    setIsSubmitting(true)
    try {
      const response = await fetch(`${config.api.baseUrl}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          sendNotification: values.sendNotification === "Yes" ? true : false,
          phoneNumber: values.phoneNumber,
        })
      })
      const responseJson = await response.json()
      console.log(responseJson);

      if (responseJson.success) {
        toast.success("User added successfully")
        router.push("/dashboard/users")

      } else {
        toast.error("Failed to add user", responseJson.error || "Failed to add user")
      }



      // Successful login would redirect
    } catch (error: any) {
      toast.error("Failed to add user", error.message || "Failed to add user")
    }


  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sendNotification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Send Notification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>This contols if the User will be receiving Email or SMS Notification when thresholds are not met.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0762127425" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>Must be at least 8 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>This controls what permissions the user has.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
            Cancel
          </Button>
          <Button className="bg-green-700 hover:bg-green-600" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
