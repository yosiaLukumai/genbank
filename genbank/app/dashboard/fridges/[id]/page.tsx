"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { FridgeDetails } from "@/components/fridge-details"
import { getFridges } from "@/lib/data"
import { Loader2 } from "lucide-react"
import { AddFridgeForm } from "@/components/add-fridge-form"
import { config } from "@/config/config"
import { Button } from "@/components/ui/button"

interface Log {
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

interface Fridge {
  _id: string;
  name: string;
  capacity: number;
  humiditymax: number;
  tempmax: number;
  refrigerator_type: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiData {
  logs: Log[];
  fridge: Fridge;
}

export default function FridgeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [fridge, setFridge] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")
  const [error, setError] = useState(false)
  const [isNewRoute, setIsNewRoute] = useState(params.id === "new")


  useEffect(() => {
    setIsNewRoute(params.id === "new")
  }, [params.id])

  // Special case for "new" route
  if (isNewRoute) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Add New Freezer"
          description="Add a new freezer to monitor"
          backLink={{
            label: "Back to fridges",
            href: "/dashboard/fridges",
          }}
        />
        <div className="rounded-lg border bg-white p-6 shadow">
          <AddFridgeForm />
        </div>
      </div>
    )
  }

  useEffect(() => {
    async function loadFridge() {
      try {
        setLoading(true)

        const response = await fetch(`${config.api.baseUrl}/refrigerators/specific/yet/${params.id}`)
        
        const data = await response.json()
        if(data.success) { 
          
          let dat: ApiData = data.body
          setFridge(dat)
          setError(false)
        }else {
            setError(true)
            setLoading(false)
            return
        }

     
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadFridge()
  }, [params.id, timeRange, router])



  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (error || !fridge) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Freezer Not Found"
          description="The requested Freezer could not be found"
          backLink={{
            label: "Back to freezer",
            href: "/dashboard/fridges",
          }}
        />
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-6 text-center">
          <h2 className="text-lg font-medium text-destructive">Fridge Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The fridge you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/dashboard/fridges")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Return to Fridges List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={fridge.fridge.name}
        description="Temp and Humidity of the freezer"
        backLink={{
          label: "Back to freezer",
          href: "/dashboard/fridges",
        }}
      />

      {/* <Button >Refresh</Button> */}

      <FridgeDetails fridge={fridge.fridge} logs={fridge.logs}  />
    </div>
  )
}
