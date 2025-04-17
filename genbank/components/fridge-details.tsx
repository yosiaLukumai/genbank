"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { TemperatureHumidityGraph } from "@/components/temperature-humidity-graph"
import { Separator } from "@/components/ui/separator"
import {
  Thermometer,
  Droplet,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCcw,
  CalendarClock,
  Gauge,
  Bell,
  Settings,
  Info,
} from "lucide-react"

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


export function FridgeDetails({ fridge, logs }: ApiData) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Normal
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-yellow-500">
            <AlertTriangle className="mr-1 h-3 w-3" /> Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge className="bg-red-500">
            <AlertTriangle className="mr-1 h-3 w-3" /> Critical
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const isTemperatureInRange = true
  // const isTemperatureInRange =
  //   fridge.temperature >= fridge.thresholds.temperature.min && fridge.temperature <= fridge.thresholds.temperature.max
  const isHumidityInRange = false
  // const isHumidityInRange =
  //   fridge.humidity >= fridge.thresholds.humidity.min && fridge.humidity <= fridge.thresholds.humidity.max

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Temperature Card */}
        <Card className={`border-l-4 ${isTemperatureInRange ? "border-l-green-500" : "border-l-red-500"}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="mr-2 h-4 w-4 text-primary" />
                Temperature
              </div>
              {/* {getStatusBadge(fridge.status)} */}
            </CardTitle>
            <CardDescription>Current reading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{logs[0].fridgetemp.toFixed(2)} °C</div>
              <div className="text-sm text-muted-foreground">
                Max: {fridge.tempmax} °C
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card className={`border-l-4 ${isHumidityInRange ? "border-l-green-500" : "border-l-red-500"}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Droplet className="mr-2 h-4 w-4 text-primary" />
                Humidity
              </div>
              {/* {getStatusBadge(fridge.status)} */}
            </CardTitle>
            <CardDescription>Current reading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{logs[0].fridgehum.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">
                Max: {fridge.humiditymax}%
              </div>
            </div>
          </CardContent>
        </Card>

  
      </div>

 

     
          <Card>
            <CardHeader>
              <CardTitle>Temperature Analysis</CardTitle>
              <CardDescription>Detailed temperature monitoring</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <TemperatureHumidityGraph
                data={logs}
                isFridge={true}
              />
            </CardContent>
          </Card>


     

    </div>
  )
}
