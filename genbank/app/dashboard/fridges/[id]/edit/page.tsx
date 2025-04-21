"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { EditFridgeForm } from "@/components/edit-fridge"
import { config } from "@/config/config"

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

export default function EditFridgePage() {
  const params = useParams()
  const router = useRouter()
  const [fridge, setFridge] = useState<Fridge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadFridge() {
      try {
        setLoading(true)
        const fridge = await fetch(`${config.api.baseUrl}/refrigerators/specific/${params.id}`)
        const data = await fridge.json()
        if(data.success) { 
          let dat: Fridge = data.body
          setFridge(dat)
          setError(false)
        }else {
            setError(true)
            setLoading(false)
            return
        }

        setError(false)
      } catch (error) {
        console.error("Error loading fridge data:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadFridge()
  }, [params.id])

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
          title="Fridge Not Found"
          description="The requested fridge could not be found"
          backLink={{
            label: "Back to fridges",
            href: "/dashboard/fridges",
          }}
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>The fridge you are trying to edit does not exist or has been removed.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit ${fridge.name}`}
        description="Modify fridge details and specifications"
        backLink={{
          label: "Back to fridge details",
          href: `/dashboard/fridges/${fridge._id}`,
        }}
      />
      <div className="rounded-lg border bg-white p-6 shadow">
        <EditFridgeForm defaultData={fridge} />
      </div>
    </div>
  )
}
