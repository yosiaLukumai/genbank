"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { config } from "@/config/config";
import { PageHeader } from "@/components/page-header";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "Admin" | "Viewer" | "User";
    sendNotification: boolean;
    phoneNumber: string;
    createdAt: string;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.enum(["Admin", "User", "Viewer"], {
        required_error: "Please select a role.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    sendNotification: z.enum(["Yes", "No"], {
        required_error: "Please select Notification Preference.",
    }),
    phoneNumber: z.string().optional(),
});

interface EditUserFormProps {
    userId: string;
}

export default function EditUserForm() {
    const router = useRouter();
    const params = useParams();
    console.log(params);

    const userId = Array.isArray(params.id) ? params.id[0] : params.id; // Handle cases where params.id might be an array
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<User | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "User",
            password: "",
            sendNotification: "No",
            phoneNumber: "",
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`${config.api.baseUrl}/users/specific/${userId}`);
                    if (response.ok) {
                        const userDat: any = await response.json();
                        const userData: User = userDat.body;
                        setInitialData(userData);
                        form.reset({
                            name: userData.name,
                            email: userData.email,
                            role: userData.role,
                            password: "",
                            sendNotification: userData.sendNotification ? "Yes" : "No",
                            phoneNumber: userData.phoneNumber,
                        });
                    } else {
                        toast.error("Failed to load user data.");
                        router.push("/dashboard/users"); // Redirect if data fetch fails
                    }
                } catch (error: any) {
                    toast.error("Error loading user data:", error.message);
                    router.push("/dashboard/users"); // Redirect on error
                }
            }
        };

        fetchUserData();
    }, [userId, form, router]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        try {
            if (!userId) {
                toast.error("User ID is missing.");
                return;
            }

            const response = await fetch(`${config.api.baseUrl}/users/update/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    role: values.role,
                    password: values.password,
                    sendNotification: values.sendNotification === "Yes" ? true : false,
                    phoneNumber: values.phoneNumber,
                }),
            });

            const responseJson = await response.json();

            if (responseJson.success) {
                toast.success("User updated successfully");
                router.push("/dashboard/users");
            } else {
                toast.error("Failed to update user", responseJson.error || "Failed to update user");
            }
        } catch (error: any) {
            toast.error("Failed to update user", error.message || "Failed to update user");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!initialData && userId) {
        return <div>Loading user data...</div>; // Or a more informative loading state
    }

    if (!userId) {
        return <div>Error: User ID not provided.</div>;
    }

    return (

        <div className="space-y-6">
            <PageHeader
                title="Users"
                description="Edit user details"
            />

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
                                        <Input type="password" placeholder="......." {...field} />
                                    </FormControl>
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
                            {isSubmitting ? "Updating..." : "Update User"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>

    );
}