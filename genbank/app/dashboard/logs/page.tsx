// "use client"

// import { useState, useEffect } from "react"
// import { PageHeader } from "@/components/page-header"
// import { LogsDataTable } from "@/components/logs-data-table"

// import { Button } from "@/components/ui/button"
// import { Download, Loader2, RefreshCcw } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { exportToCSV, exportToJSON } from "@/lib/export-utils"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Separator } from "@/components/ui/separator"
// import { useMediaQuery } from "@/hooks/use-media-query"
// import { config } from "@/config/config"
// import { toast } from "sonner"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// interface Logs {
//   _id: string;
//   roomtemp: number;
//   roomhum: number;
//   fridgetemp: number;
//   fridgehum: number;
//   fridgeID: {
//     _id: string;
//     name: string;
//   };
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }


// interface Fridge {
//   _id: string;
//   name: string;
//   capacity: number;
//   humiditymax: number;
//   tempmax: number;
//   refrigerator_type: string;
// }



// export default function LogsPage() {
//   const [logs, setLogs] = useState<Logs[]>([])
//   const [fridges, setFridges] = useState<Fridge[]>([])
//   const [selectedFridgeId, setSelectedFridgeId] = useState<string | null>(null)
//   const [selectedCustom, setSelectedCustom] = useState<string | null>(null)
//   const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
//     from: new Date(new Date().setDate(new Date().getDate() - 7)),
//     to: new Date(),
//   })
//   const [loading, setLoading] = useState(true)
//   const [exporting, setExporting] = useState(false)

//   // Check if the screen is mobile
//   const isMobile = useMediaQuery("(max-width: 768px)")

//   useEffect(() => {
//     fetchData()
//     fetchFridges()
//   }, [selectedFridgeId, selectedCustom])


//   const fetchFridges = async () => {
//     try {
//       let responses = await fetch(`${config.api.baseUrl}/refrigerators/last`)
//       let jsonR = await responses.json()

//       if (jsonR.success) {
//         setLoading(false)
//         setFridges(jsonR.body)
//       } else {
//         setLoading(false)
//         toast.error("Error Happened", {
//           description: jsonR.error || jsonR.body || "Failed to fetch the Fridges"
//         })
//       }
//     } catch (error) {
//       setLoading(false)
//       toast.error("Operation Error", {
//         description: "Failed to fetch the Fridges"
//       })
//     }
//   }
//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch(`${config.api.baseUrl}/alllogs/table?fridgeID=${selectedFridgeId}&date=${selectedCustom === "custom_date"? null: selectedCustom}`)
//       const data = await response.json()
//       if (data.success) {
//         setLoading(false)
//         let dat: Logs[] = data.body.docs
//         setLogs(dat)
//         // setSelectedFridgeId(dat[0].fridgeID._id)
//       } else {
//         setLoading(false)
//         toast.error("Error Happened", {
//           description: data.error || data.body || "Failed to fetch the Logs"
//         })
//       }
//     } catch (error) {

//       console.error("Error fetching data:", error)
//       setLoading(false)
//       toast.error("Operation Error", {
//         description: "Failed to fetch the Logs"
//       })
//     }
//   }

//   const filteredLogs = logs?.filter((log) => {
//     try {
//       const logDate = new Date(log.createdAt.replace(" ", "T"))
//       const isInDateRange = logDate >= dateRange.from && logDate <= dateRange.to

//       if (selectedFridgeId && log.fridgeID._id !== selectedFridgeId) {
//         return false
//       }

//       return isInDateRange
//     } catch (error) {
//       console.error("Error filtering log:", error)
//       return false
//     }
//   })

//   const handleExport = async (format: "csv" | "json") => {
//     setExporting(true)

//     try {
//       const filename = `genbank-logs-${selectedFridgeId || "all"}-${new Date().toISOString().split("T")[0]}`

//       if (format === "csv") {
//         exportToCSV(logs, filename)
//       } else {
//         exportToJSON(logs, filename)
//       }
//     } catch (error) {
//       console.error(`Error exporting to ${format}:`, error)
//     } finally {
//       setExporting(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <PageHeader
//         title="Temperature & Humidity Logs"
//         description="View and export historical temperature and humidity data"
//       />

//       <div
//         className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4 ${isMobile ? "" : "items-center justify-between"}`}
//       >
//         <div className={`flex ${isMobile ? "flex-col" : "flex-wrap"} gap-2 ${isMobile ? "" : "items-center"}`}>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="outline" size="sm">
//                 Select Fridge
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-40">
//               <div className="flex flex-col space-y-2">
//                 <Select
//                   value={selectedFridgeId || "all"}
//                   onValueChange={(value) => setSelectedFridgeId(value)}
//                 >
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select a fridge" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {fridges.map((f) => (
//                       <SelectItem key={f._id} value={f._id}>
//                         {f.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </PopoverContent>
//           </Popover>
//           <Popover>
//           <PopoverTrigger asChild>
//               <Button variant="outline" size="sm">
//                 Select Date
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="">
//               <Select value={selectedCustom ? selectedCustom : undefined} onValueChange={(value) => setSelectedCustom(value)}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Select a date" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="week">Last week</SelectItem>
//                   <SelectItem value="month">Last Month</SelectItem>  
//                   <SelectItem value="custom_date">Last Month</SelectItem>  
//                 </SelectContent>
//               </Select>
//             </PopoverContent>
//           </Popover>
//         </div>

//         <div className={`flex gap-2 ${isMobile ? "mt-2" : ""}`}>
//           <Button variant="outline" size="sm" onClick={fetchData} className="flex-1 md:flex-none">
//             <RefreshCcw className="mr-2 h-4 w-4" />
//             Refresh
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button disabled={exporting || filteredLogs.length === 0} className="flex-1 bg-green-600 hover:bg-green-700 md:flex-none">
//                 {exporting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Exporting...
//                   </>
//                 ) : (
//                   <>
//                     <Download className="mr-2 h-4 w-4" />
//                     Export
//                   </>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
//               {/* <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem> */}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       <Separator className="my-4" />

//       <Card className="p-4">
//         {loading ? (
//           <div className="flex h-[400px] items-center justify-center">
//             <Loader2 className="h-8 w-8 animate-spin text-[#3a86fe]" />
//           </div>
//         ) : (
//           <LogsDataTable
//             data={logs}
//             emptyMessage={
//               selectedFridgeId
//                 ? "No logs found for the selected fridge in this date range."
//                 : "No logs found for the selected date range."
//             }
//           />
//         )}
//       </Card>
//     </div>
//   )
// }





"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { LogsDataTable } from "@/components/logs-data-table"

import { Button } from "@/components/ui/button"
import { Download, Loader2, RefreshCcw } from "lucide-react"
import { Card } from "@/components/ui/card"
import { exportToCSV, exportToJSON } from "@/lib/export-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { config } from "@/config/config"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/date-picker-range"
import { DateRange } from "react-day-picker"

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
  const [selectedCustom, setSelectedCustom] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })

  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  // Check if the screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    fetchData()
    fetchFridges()
  }, [selectedFridgeId, selectedCustom, selectedDate])


  const fetchFridges = async () => {
    try {
      let responses = await fetch(`${config.api.baseUrl}/refrigerators/last`)
      let jsonR = await responses.json()

      if (jsonR.success) {
        setLoading(false)
        setFridges(jsonR.body)
      } else {
        setLoading(false)
        toast.error("Error Happened", {
          description: jsonR.error || jsonR.body || "Failed to fetch the freezers"
        })
      }
    } catch (error) {
      setLoading(false)
      toast.error("Operation Error", {
        description: "Failed to fetch the freezers"
      })
    }
  }
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${config.api.baseUrl}/alllogs/table?fridgeID=${selectedFridgeId}&date=${selectedCustom == "custom_date" ? null: selectedCustom}&limit=100${urlDateLimit()}`)
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

  const filteredLogs = logs;

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

  const urlDateLimit = () => {
    if(selectedCustom === "custom_date" && selectedDate != undefined) {
      return  `&startDate=${selectedDate?.from?.toISOString().split("T")[0]}&endDate=${selectedDate?.to?.toISOString().split("T")[0]}`
    }
    return ""
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Select Freezer
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col space-y-2">
                <Select
                  value={selectedFridgeId || "all"}
                  onValueChange={(value) => setSelectedFridgeId(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a freezer" />
                  </SelectTrigger>
                  <SelectContent>
                    {fridges.map((f) => (
                      <SelectItem key={f._id} value={f._id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Select Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="">
              <Select value={selectedCustom ? selectedCustom : undefined} onValueChange={(value) => setSelectedCustom(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="custom_date">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>

          {selectedCustom === "custom_date" && (
            <DatePickerWithRange className="" value={selectedDate} onChange={setSelectedDate} />
          )}
        </div>

        <div className={`flex gap-2 ${isMobile ? "mt-2" : ""}`}>
          <Button variant="outline" size="sm" onClick={fetchData} className="flex-1 md:flex-none">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={exporting || filteredLogs.length === 0} className="flex-1 bg-green-600 hover:bg-green-700 md:flex-none">
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
              {/* <DropdownMenuItem onClick={() => handleExport("json")}>Export as JSON</DropdownMenuItem> */}
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
                ? "No logs found for the selected freezer in this date range."
                : "No logs found for the selected date range."
            }
          />
        )}
      </Card>
    </div>
  )
}


