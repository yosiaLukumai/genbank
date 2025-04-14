"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { LogsDataTable } from "@/components/logs-data-table"
import { FridgeSelector } from "@/components/fridge-selector"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download, Loader2, RefreshCcw } from "lucide-react"
import { getLogs, getFridges } from "@/lib/data"
import { Card } from "@/components/ui/card"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { config } from "@/config/config"
import { toast } from "sonner"

interface Logs {
  _id: string;
  roomtemp: number;
  roomhum: number;
  fridgetemp: number;
  fridgehum: number;
  fridgeID: {
    _id: string;
    name: string;
  };
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
}



export default function LogsPage() {
  const [logs, setLogs] = useState<Logs[]>([])
  const [fridges, setFridges] = useState<Fridge[]>([])
  const [selectedFridgeId, setSelectedFridgeId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  // Check if the screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    fetchData()
    fetchFridges()
  }, [])


  const fetchFridges = async () => {
    try {
      let responses = await fetch(`${config.api.baseUrl}/refrigerators/last`)
      let jsonR = await responses.json()
      console.log(jsonR);

      if (jsonR.success) {
        setLoading(false)
        setFridges(jsonR.body)
      } else {
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
  const fetchData = async () => {
    try {

      setLoading(true)
      const response = await fetch(`${config.api.baseUrl}/alllogs/table`)
      const data = await response.json()
      if (data.success) {
        setLoading(false)
        let dat: Logs[] = data.body.docs
        setLogs(dat)
        // setSelectedFridgeId(dat[0].fridgeID._id)
      } else {
        setLoading(false)
        toast.error("Error Happened", {
          description: data.error || data.body || "Failed to fetch the Logs"
        })
      }
    } catch (error) {

      console.error("Error fetching data:", error)
      setLoading(false)
      toast.error("Operation Error", {
        description: "Failed to fetch the Logs"
      })
    }
  }

  const filteredLogs = logs?.filter((log) => {
    try {
      const logDate = new Date(log.createdAt.replace(" ", "T"))
      const isInDateRange = logDate >= dateRange.from && logDate <= dateRange.to

      if (selectedFridgeId && log.fridgeID._id !== selectedFridgeId) {
        return false
      }

      return isInDateRange
    } catch (error) {
      console.error("Error filtering log:", error)
      return false
    }
  })

  const handleFridgeSelect = (fridgeId: any) => {
    setSelectedFridgeId(fridgeId === "all" ? null : fridgeId)
  }

  const handleExport = async (format: "csv" | "json") => {
    setExporting(true)

    try {
      const filename = `genbank-logs-${selectedFridgeId || "all"}-${new Date().toISOString().split("T")[0]}`

      if (format === "csv") {
        exportToCSV(logs, filename)
      } else {
        exportToJSON(logs, filename)
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Temperature & Humidity Logs"
        description="View and export historical temperature and humidity data"
      />

      <div
        className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4 ${isMobile ? "" : "items-center justify-between"}`}
      >
        <div className={`flex ${isMobile ? "flex-col" : "flex-wrap"} gap-2 ${isMobile ? "" : "items-center"}`}>
          <FridgeSelector
            fridges={[{ _id: "all", name: "All Fridges" }, ...fridges]}
            selectedFridgeId={selectedFridgeId || "all"}
            onSelect={handleFridgeSelect}
          />
          {/* <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} /> */}
        </div>

        <div className={`flex gap-2 ${isMobile ? "mt-2" : ""}`}>
          <Button variant="outline" size="sm" onClick={fetchData} className="flex-1 md:flex-none">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={exporting || filteredLogs.length === 0} className="flex-1 md:flex-none">
                {exporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator className="my-4" />

      <Card className="p-4">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#3a86fe]" />
          </div>
        ) : (
          <LogsDataTable
            data={logs}
            emptyMessage={
              selectedFridgeId
                ? "No logs found for the selected fridge in this date range."
                : "No logs found for the selected date range."
            }
          />
        )}
      </Card>
    </div>
  )
}
