// "use client"

// import { useState, useEffect } from "react"
// import { FridgeSelector } from "./fridge-selector"
// import { Button } from "./ui/button"
// import { RefreshCcw } from "lucide-react"

// interface LocalUser {
//   name: string
//   email: string
//   createdAt: string
//   role: "Admin" | "User" | "Viewer"
// }


// interface LatestLog {
//   _id: string;
//   fridgeID: string;
//   roomtemp: number;
//   roomhum: number;
//   fridgetemp: number;
//   fridgehum: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// interface ApiData {
// __v: number;
// _id: string;
// name: string;
// capacity: number;
// humiditymax: number;
// tempmax: number;
// refrigerator_type: string;
// latestlog: LatestLog[] | null;
// }

// interface Props {
//   fridge: ApiData[];
//   handleRefresh: () => void;
//   refreshing: boolean;
//   selectedFridge: ApiData | null;
//   handleFridgeSelect: (fridge: string) => void;
// }

// export function DashboardHeader({ fridge, selectedFridge, handleFridgeSelect, handleRefresh, refreshing }: Props) {
//   const [user, setUser] = useState<LocalUser | null>(null)
//   const [loading, setLoading] = useState(true)


//   useEffect(() => {
//     async function loadUser() {
//       try {
//         setLoading(true)
//         let user: LocalUser = JSON.parse(localStorage.getItem("user_wvc")!)
//         setUser(user)
//       } catch (error) {
//         console.error("Error loading user data:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadUser()
//   }, [])

//   return (
//     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-muted-foreground">{loading ? "Loading..." : `Welcome back, ${user?.name}`}</p>
//       </div>
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
//               <div className="flex items-center gap-2">
//                 <FridgeSelector fridges={fridge} selectedFridgeId={selectedFridge?._id || "unknown"} onSelect={handleFridgeSelect} />
//                 <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
//                   <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
//                   {refreshing ? "Refreshing..." : "Refresh"}
//                 </Button>
//               </div>
//             </div>
//     </div>
//   )
// }




"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocalUser {
  name: string;
  email: string;
  createdAt: string;
  role: "Admin" | "User" | "Viewer";
}

interface LatestLog {
  _id: string;
  fridgeID: string;
  roomtemp: number;
  roomhum: number;
  fridgetemp: number;
  fridgehum: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiData {
  __v: number;
  _id: string;
  name: string;
  capacity: number;
  humiditymax: number;
  tempmax: number;
  refrigerator_type: string;
  latestlog: LatestLog[] | null;
}

interface Props {
  fridge: ApiData[];
  handleRefresh: () => void;
  refreshing: boolean;
  selectedFridge: ApiData | null;
  handleFridgeSelect: (fridgeId: string) => void;
}

export function DashboardHeader({
  fridge,
  selectedFridge,
  handleFridgeSelect,
  handleRefresh,
  refreshing,
}: Props) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFridgeId, setSelectedFridgeId] = useState<string | undefined>(
    selectedFridge?._id
  );

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        let user: LocalUser = JSON.parse(localStorage.getItem("user_wvc")!);
        setUser(user);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    if (selectedFridgeId) {
      handleFridgeSelect(selectedFridgeId);
    }
  }, [selectedFridgeId, handleFridgeSelect]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-green-700">Dashboard</h1>
        <p className="text-muted-foreground">
          {loading ? "Loading..." : `Welcome back, ${user?.name}`}
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Select Freezer
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex flex-col space-y-2">
                <Select
                  value={selectedFridgeId}
                  onValueChange={(value) => setSelectedFridgeId(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a freezer" />
                  </SelectTrigger>
                  <SelectContent>
                    {fridge.map((f) => (
                      <SelectItem key={f._id} value={f._id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
    </div>
  );
}