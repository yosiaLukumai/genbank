"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table-column-header"
import { AlertTriangle, CheckCircle, Thermometer, Droplet } from "lucide-react"
import { format } from "date-fns"

export type Log = {
  id: string
  timestamp: string
  deviceId: string
  deviceType: "room" | "fridge"
  deviceName: string
  temperature: number
  humidity: number
  status: "normal" | "warning" | "critical"
}

export const enhancedColumns: ColumnDef<Log>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string
      // Format the timestamp for display
      const date = new Date(timestamp.replace(" ", "T"))
      return <div>{format(date, "MMM dd, yyyy HH:mm:ss")}</div>
    },
  },
  {
    accessorKey: "deviceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => <div className="capitalize">{row.getValue("deviceType")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "deviceName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Device" />,
    cell: ({ row }) => <div>{row.getValue("deviceName")}</div>,
  },
  {
    accessorKey: "temperature",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Temperature" />,
    cell: ({ row }) => {
      const temp = row.getValue("temperature") as number
      const status = row.getValue("status") as string

      return (
        <div className="flex items-center">
          <Thermometer
            className={`mr-2 h-4 w-4 ${
              status === "critical" ? "text-red-500" : status === "warning" ? "text-yellow-500" : "text-green-500"
            }`}
          />
          <span>{temp.toFixed(1)} °C</span>
        </div>
      )
    },
  },
  {
    accessorKey: "humidity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Humidity" />,
    cell: ({ row }) => {
      const humidity = row.getValue("humidity") as number
      const status = row.getValue("status") as string

      return (
        <div className="flex items-center">
          <Droplet
            className={`mr-2 h-4 w-4 ${
              status === "critical" ? "text-red-500" : status === "warning" ? "text-yellow-500" : "text-green-500"
            }`}
          />
          <span>{humidity.toFixed(1)}%</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string

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
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
