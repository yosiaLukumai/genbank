"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplet, AlertTriangle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export function MonitoringCards({_id, latestlog, __v, capacity, tempmax, humiditymax, name}: ApiData) {
  console.log(latestlog);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return (
          <Badge className="bg-green-500 absolute top-2 right-2">
            <CheckCircle className="mr-1 h-3 w-3" /> Normal
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-yellow-500 absolute top-2 right-2">
            <AlertTriangle className="mr-1 h-3 w-3" /> Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge className="bg-red-500 absolute top-2 right-2">
            <AlertTriangle className="mr-1 h-3 w-3" /> Critical
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-[#121212] text-white relative">
        {/* {roomData.status && getStatusBadge(roomData.status)} */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Room Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestlog ? latestlog[latestlog?.length-1]?.roomhum : 0} °C</div>
        </CardContent>
      </Card>

      <Card className="bg-[#121212] text-white relative">
        {/* {roomData.status && getStatusBadge(roomData.status)} */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Room Humidity</CardTitle>
          <Droplet className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestlog ? latestlog[latestlog?.length-1]?.roomtemp : 0} %</div>
        </CardContent>
      </Card>

      <Card className="bg-[#121212] text-white relative">
        {/* {getStatusBadge(selectedFridge.status)} */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate" title={name}>
            {name} Temp
          </CardTitle>
          <Thermometer className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestlog ? latestlog[latestlog?.length-1]?.fridgetemp : 0} °C</div>
        </CardContent>
      </Card>

      <Card className="bg-[#121212] text-white relative">
        {/* {getStatusBadge(selectedFridge.status)} */}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium truncate" title={name}>
            {name} Humidity
          </CardTitle>
          <Droplet className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{latestlog ? latestlog[latestlog?.length-1]?.fridgehum : 0}%</div>
        </CardContent>
      </Card>
    </div>
  )
}
