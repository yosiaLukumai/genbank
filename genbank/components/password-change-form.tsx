"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"

// Password schema with strong password requirements
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function PasswordChangeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    let strength = 0
    const feedback = []

    // Length check
    if (password.length >= 8) {
      strength += 1
    } else {
      feedback.push("at least 8 characters")
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1
    } else {
      feedback.push("an uppercase letter")
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1
    } else {
      feedback.push("a lowercase letter")
    }

    // Number check
    if (/[0-9]/.test(password)) {
      strength += 1
    } else {
      feedback.push("a number")
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1
    } else {
      feedback.push("a special character")
    }

    setPasswordStrength(strength)

    if (feedback.length > 0) {
      setPasswordFeedback(`Add ${feedback.join(", ")}`)
    } else {
      setPasswordFeedback("Strong password!")
    }
  }

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
        variant: "default",
      })

      // Reset form
      form.reset()
      setPasswordStrength(0)
      setPasswordFeedback("")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Enter your current password"
                    type={showCurrentPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Enter your new password"
                    type={showNewPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
                    onChange={(e) => {
                      field.onChange(e)
                      calculatePasswordStrength(e.target.value)
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex h-2 w-full gap-1 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        passwordStrength >= 1
                          ? passwordStrength < 3
                            ? "bg-red-500"
                            : passwordStrength < 5
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          : ""
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 20}%` }}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        passwordStrength >= 2
                          ? passwordStrength < 3
                            ? "bg-red-500"
                            : passwordStrength < 5
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          : ""
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 20}%` }}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${
                        passwordStrength >= 3 ? (passwordStrength < 5 ? "bg-yellow-500" : "bg-green-500") : ""
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 20}%` }}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${passwordStrength >= 4 ? "bg-green-500" : ""}`}
                      style={{ width: `${(passwordStrength / 5) * 20}%` }}
                    />
                    <div
                      className={`h-full rounded-full transition-all ${passwordStrength >= 5 ? "bg-green-500" : ""}`}
                      style={{ width: `${(passwordStrength / 5) * 20}%` }}
                    />
                  </div>
                </div>
                <p
                  className={`mt-1 text-xs ${
                    passwordStrength === 5
                      ? "text-green-500"
                      : passwordStrength >= 3
                        ? "text-yellow-500"
                        : passwordStrength > 0
                          ? "text-red-500"
                          : "text-muted-foreground"
                  }`}
                >
                  {passwordFeedback}
                </p>
              </div>
              <FormDescription>
                Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="Confirm your new password"
                    type={showConfirmPassword ? "text" : "password"}
                    {...field}
                    className="pr-10"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </Form>
  )
}
