// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Trash2Icon } from "lucide-react";
// import { toast } from "sonner";
// import { config } from "@/config/config"; // Assuming you have your API config here

// interface DeleteResourceProps {
//   resourceId: string;
//   resourceName?: string; // Optional name to display in the confirmation
//   apiEndpoint: string; // The specific API endpoint for deleting this resource (e.g., `/refrigerators`)
//   onSuccess?: () => void; // Optional callback function after successful deletion
// }

// export function DeleteResource({
//   resourceId,
//   resourceName = "this item",
//   apiEndpoint,
//   onSuccess,
// }: DeleteResourceProps) {
//   const router = useRouter();
//   const [open, setOpen] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       const response = await fetch(`${config.api.baseUrl}${apiEndpoint}/${resourceId}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         toast.success(`${resourceName} deleted successfully.`);
//         if (onSuccess) {
//           onSuccess();
//         }
//         router.refresh(); // Refresh the route to reflect the deletion
//       } else {
//         const errorData = await response.json();
//         toast.error(`Failed to delete ${resourceName}. ${errorData?.message || "An error occurred."}`);
//       }
//     } catch (error: any) {
//       toast.error(`Failed to delete ${resourceName}. ${error.message || "Network error."}`);
//     } finally {
//       setIsDeleting(false);
//       setOpen(false);
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogTrigger asChild>
//         <Button variant="destructive" size="sm">
//           <Trash2Icon className="mr-2 h-4 w-4" />
//           Delete
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. Are you sure you want to delete{" "}
//             <span className="font-medium">{resourceName}</span> with ID{" "}
//             <span className="font-medium">{resourceId}</span>?
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
//             {isDeleting ? "Deleting..." : "Delete"}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // Keep Button import for actions
import { Trash2Icon } from "lucide-react"; // Keep icon import if you want to display it
import { toast } from "sonner";
import { config } from "@/config/config"; // Assuming you have your API config here

interface DeleteResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string | null; // Can be null if no resource is selected for deletion
  resourceName?: string;
  apiEndpoint: string;
  onSuccess?: () => void;
}

export function DeleteResourceDialog({
  isOpen,
  onClose,
  resourceId,
  resourceName = "this item",
  apiEndpoint,
  onSuccess,
}: DeleteResourceDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Reset deleting state when the dialog closes
    if (!isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!resourceId) {
      toast.error("No resource ID provided for deletion.");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${config.api.baseUrl}${apiEndpoint}/${resourceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`${resourceName} deleted successfully.`);
        if (onSuccess) {
          onSuccess();
        }
        router.refresh(); // Refresh the route to reflect the deletion
        onClose(); // Close the dialog on success
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete ${resourceName}. ${errorData?.message || "An error occurred."}`);
      }
    } catch (error: any) {
      toast.error(`Failed to delete ${resourceName}. ${error.message || "Network error."}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete{" "}
            <span className="font-medium">{resourceName}</span>
            {resourceId && (
              <>
                {" "}with ID <span className="font-medium">{resourceId}</span>?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}