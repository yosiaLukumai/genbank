"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MonitoringCards } from "@/components/monitoring-cards"
import { FridgeSelector } from "@/components/fridge-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCcw } from "lucide-react"
import { EnvironmentalGraph } from "@/components/environmental-graph"
import { toast } from "sonner"
import { config } from "@/config/config"



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

export default function DashboardPage() {
  const [roomData, setRoomData] = useState(null)
  const [fridge, setfridges] = useState<ApiData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFridge, setSelectedFridge] = useState<ApiData | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const fetchFridges = async () => {
    try {
      let responses = await fetch(`${config.api.baseUrl}/refrigerators/last/all`)
      let jsonR = await responses.json()
      
      if(jsonR.success) {
        setLoading(false)
        setfridges(jsonR.body)
        setSelectedFridge(jsonR.body[0])
      }else {
        setLoading(false)
        toast.error("Error Happened", {
          description: jsonR.error || jsonR.body || "Failed to fetch the Fridges"
        })
      }
    } catch (error) {
      setLoading(false)
      toast.error("Operation Error", {
        description: "Failed to fetch the Fridges"
      })
    }
  }
  useEffect(() => {
  
    fetchFridges()
    setLoading(false)
  }, [])





  // Handle fridge selection
  const handleFridgeSelect = (fridgeId: string):void => {
    if(fridge) {
      let fridgs = fridge.find((f) => f._id === fridgeId)
      if(!fridgs) return
      setSelectedFridge(fridgs)
    }

  }



  const handleRefresh = () => {
    setRefreshing(true)
    fetchFridges()
  }

  if (loading && !roomData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3a86fe]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader  fridge={fridge} handleFridgeSelect={handleFridgeSelect} handleRefresh={handleRefresh} refreshing={refreshing} selectedFridge={selectedFridge}  />
      {selectedFridge && (
        <MonitoringCards {...selectedFridge} />
      )}



      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Room Environment</CardTitle>
            <CardDescription>Temperature and humidity conditions in the main cold room</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                </div>
              </div>
            ) : (
              <EnvironmentalGraph
                type="room"
                data={selectedFridge?.latestlog || []}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fridge Environment</CardTitle>
            <CardDescription>Temperature and humidity conditions in selected fridge</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                </div>
              </div>
            ) : selectedFridge ? (
              <EnvironmentalGraph
                type="fridge"
                key={selectedFridge._id}
                data={selectedFridge.latestlog || []}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No fridge selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
