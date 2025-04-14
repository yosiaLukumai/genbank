"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Thermometer, Droplet, MoreVertical, AlertTriangle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { config } from "@/config/config"
import Loader from "./Loader"



interface FridgeLastLog {
  _id: string;
  roomtemp: number;
  roomhum: number;
  fridgetemp: number;
  fridgehum: number;
  updatedAt: string
}

interface Fridge {
 _id: string;
 name: string;
 capacity: number;
 humiditymax: number;
 tempmax: number;
 refrigerator_type: string;
 latestLog: FridgeLastLog | null
}

export function FridgesList() {
  const [fridgesList, setFridgesList] = useState<Fridge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFridges = async () => {
      try {
        let responses = await fetch(`${config.api.baseUrl}/refrigerators/last`)
        let jsonR = await responses.json()
        console.log(jsonR);
        
        if(jsonR.success) {
          setLoading(false)
          setFridgesList(jsonR.body)
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
    fetchFridges()
    setLoading(false)
  }, [])

  const getStatusBadge = (fridge: Fridge) => {
    let status: any;
    if(fridge.latestLog) {
    status= ((fridge.latestLog?.fridgehum > fridge.humiditymax) || (fridge.latestLog.fridgetemp > fridge.tempmax)) ? "warning": "normal";
    }else {
    status = "critical"
    }
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

  const handleDelete = (id: string) => {
    setFridgesList(fridgesList.filter((fridge) => fridge._id !== id))
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {
        loading && <div className="w-full h-full">  <Loader message="Loading fridges"/> </div>
      }
      {fridgesList.map((fridge) => (
        <Card key={fridge._id} className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{fridge.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/fridges/${fridge._id}`}>View Details</Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href={`/dashboard/fridges/${fridge._id}/edit`}>Edit</Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => handleDelete(fridge._id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>Last updated: {fridge.latestLog?.updatedAt}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Thermometer className="mr-1 h-4 w-4" />
                  Temperature
                </div>
                <div className="text-xl font-bold">{fridge.latestLog?.roomtemp} °C</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Droplet className="mr-1 h-4 w-4" />
                  Humidity
                </div>
                <div className="text-xl font-bold">{fridge.latestLog?.fridgehum}%</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {getStatusBadge(fridge)}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/fridges/${fridge._id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
