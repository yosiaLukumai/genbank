"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { config } from "@/config/config";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Freezer name must be at least 2 characters.",
  }),
  capacity: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Capacity must be a number.",
  }),
  humiditymax: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Max humidity must be a number.",
  }).optional(),
  tempmax: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Max temperature must be a number.",
  }).optional(),
  refrigerator_type: z.string().optional(),
});

interface IRefrigerator {
  _id: string; // Assuming your data has an ID for editing
  name: string;
  capacity: number;
  humiditymax?: number;
  tempmax?: number;
  refrigerator_type?: string;
}

interface EditFridgeFormProps {
  defaultData: IRefrigerator | null;
}

export function EditFridgeForm({ defaultData }: EditFridgeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultData?.name || "",
      capacity: defaultData?.capacity?.toString() || "",
      humiditymax: defaultData?.humiditymax?.toString() || "15",
      tempmax: defaultData?.tempmax?.toString() || "-15",
      refrigerator_type: defaultData?.refrigerator_type || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name,
        capacity: defaultData.capacity?.toString() || "10",
        humiditymax: defaultData.humiditymax?.toString() || "15",
        tempmax: defaultData.tempmax?.toString() || "-15",
        refrigerator_type: defaultData.refrigerator_type || "",
      });
    }
  }, [defaultData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      if (!defaultData?._id) {
        toast.error("Error: Freezer ID not found for editing.");
        return;
      }

      const response = await fetch(`${config.api.baseUrl}/refrigerators/${defaultData._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          capacity: values.capacity,
          humiditymax: values.humiditymax,
          tempmax: values.tempmax,
          refrigerator_type: values.refrigerator_type,
        }),
      });

      let jsonResponse = await response.json();
      if (jsonResponse.success) {
        setTimeout(() => {
          setIsSubmitting(false);
          toast.success("Freezer updated", {
            description: `${values.name} has been updated successfully.`,
          });
          router.push("/dashboard/fridges");
        }, 1000);
      } else {
        toast.error("Operation Failure", {
          description: `Failed to update Freezer`,
        });
      }
    } catch (error) {
      toast.error("Error Happened", {
        description: "An error has occurred during update."
      });
    } finally {
      setIsSubmitting(false);
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
                <FormLabel>Freezer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Main Storage Freezer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (Liters)</FormLabel>
                <FormControl>
                  <Input placeholder="500" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Temperature (°C)</h3>
            <FormField
              control={form.control}
              name="tempmax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Humidity (%)</h3>
            <FormField
              control={form.control}
              name="humiditymax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="refrigerator_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refrigerator Type</FormLabel>
              <FormControl>
                <Input placeholder="Ultra-Low Freezer (MELING)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/fridges")}
          >
            Cancel
          </Button>
          <Button className="bg-green-700 hover:bg-green-600" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Freezer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}