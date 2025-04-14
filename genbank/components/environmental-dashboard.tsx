"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Thermometer, Droplet, AlertTriangle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EnvironmentalGraph } from "@/components/environmental-graph"
import { getFridges, getRoomData } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export function EnvironmentalDashboard() {
  const [loading, setLoading] = useState(true)
  const [roomData, setRoomData] = useState(null)
  const [fridgeData, setFridgeData] = useState([])
  const [selectedFridgeId, setSelectedFridgeId] = useState(null)
  const [timeRange, setTimeRange] = useState("24h")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      const room = await getRoomData(timeRange)
      const fridges = await getFridges(timeRange)

      setRoomData(room)
      setFridgeData(fridges)

      // Set the first fridge as selected by default if none is selected
      if (!selectedFridgeId && fridges.length > 0) {
        setSelectedFridgeId(fridges[0].id)
      }
    } catch (error) {
      console.error("Error fetching environmental data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  const getStatusBadge = (status) => {
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

  const selectedFridge = fridgeData.find((fridge) => fridge.id === selectedFridgeId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Environmental Monitoring</h2>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <div className="flex items-center space-x-1 rounded-md border p-1">
            {["24h", "7d", "30d"].map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`text-sm ${
                  timeRange === range && "bg-[#3a86fe] text-white hover:bg-[#3a86fe] hover:text-white"
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Room Temperature Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
              Room Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-orange-700">{roomData?.temperature.toFixed(1)} °C</div>
            )}
            {!loading && roomData && getStatusBadge(roomData.status)}
          </CardContent>
        </Card>

        {/* Room Humidity Card */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Droplet className="mr-2 h-4 w-4 text-red-500" />
              Room Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-red-700">{roomData?.humidity.toFixed(1)}%</div>
            )}
            {!loading && roomData && getStatusBadge(roomData.status)}
          </CardContent>
        </Card>

        {/* Fridge Temperature Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
              Fridge Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-blue-700">
                {selectedFridge ? selectedFridge.temperature.toFixed(1) : "N/A"} °C
              </div>
            )}
            {!loading && selectedFridge && getStatusBadge(selectedFridge.status)}
          </CardContent>
        </Card>

        {/* Fridge Humidity Card */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Droplet className="mr-2 h-4 w-4 text-cyan-500" />
              Fridge Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-cyan-700">
                {selectedFridge ? selectedFridge.humidity.toFixed(1) : "N/A"}%
              </div>
            )}
            {!loading && selectedFridge && getStatusBadge(selectedFridge.status)}
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Room Environment Graph */}
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
                data={roomData?.history || []}
                timeRange={timeRange}
                type="room"
                thresholds={roomData?.thresholds}
              />
            )}
          </CardContent>
        </Card>

        {/* Fridge Environment Graph */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Fridge Environment</CardTitle>
              <CardDescription>Temperature and humidity conditions in selected fridge</CardDescription>
            </div>
            {!loading && (
              <div className="ml-auto">
                <select
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={selectedFridgeId || ""}
                  onChange={(e) => setSelectedFridgeId(e.target.value)}
                >
                  {fridgeData.map((fridge) => (
                    <option key={fridge.id} value={fridge.id}>
                      {fridge.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
                data={selectedFridge.history || []}
                timeRange={timeRange}
                type="fridge"
                thresholds={selectedFridge.thresholds}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No fridge selected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="combined">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="combined">Combined View</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="humidity">Humidity</TabsTrigger>
        </TabsList>

        <TabsContent value="combined">
          <Card>
            <CardHeader>
              <CardTitle>Combined Environmental Data</CardTitle>
              <CardDescription>Compare room and fridge environmental conditions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                  </div>
                </div>
              ) : (
                <EnvironmentalGraph
                  data={roomData?.history || []}
                  compareData={selectedFridge?.history || []}
                  timeRange={timeRange}
                  type="combined"
                  roomThresholds={roomData?.thresholds}
                  fridgeThresholds={selectedFridge?.thresholds}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Comparison</CardTitle>
              <CardDescription>Compare room and fridge temperature trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                  </div>
                </div>
              ) : (
                <EnvironmentalGraph
                  data={roomData?.history || []}
                  compareData={selectedFridge?.history || []}
                  timeRange={timeRange}
                  type="temperature"
                  roomThresholds={roomData?.thresholds}
                  fridgeThresholds={selectedFridge?.thresholds}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humidity">
          <Card>
            <CardHeader>
              <CardTitle>Humidity Comparison</CardTitle>
              <CardDescription>Compare room and fridge humidity trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCcw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading data...</p>
                  </div>
                </div>
              ) : (
                <EnvironmentalGraph
                  data={roomData?.history || []}
                  compareData={selectedFridge?.history || []}
                  timeRange={timeRange}
                  type="humidity"
                  roomThresholds={roomData?.thresholds}
                  fridgeThresholds={selectedFridge?.thresholds}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
