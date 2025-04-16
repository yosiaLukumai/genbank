// "use client"

// import { useState } from "react"
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
//   type ColumnDef,
//   type ColumnFiltersState,
//   type SortingState,
//   type VisibilityState,
// } from "@tanstack/react-table"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { DataTablePagination } from "@/components/data-table-pagination"
// import { Button } from "@/components/ui/button"
// import { SlidersHorizontal } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { DataTableColumnHeader } from "@/components/data-table-column-header"
// import { AlertTriangle, CheckCircle, Thermometer, Droplet } from "lucide-react"
// import { format } from "date-fns"
// import { Card, CardContent } from "@/components/ui/card"
// import { useMediaQuery } from "@/hooks/use-media-query"

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

// interface LogsDataTableProps {
//   data: Logs[]
//   emptyMessage?: string;
// }

// export function LogsDataTable({ data, emptyMessage = "No results found." }: LogsDataTableProps) {
//   const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }])
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

//   // Check if the screen is mobile
//   const isMobile = useMediaQuery("(max-width: 768px)")

//   const columns: ColumnDef<Logs>[] = [
//     {
//       accessorKey: "timestamp",
//       header: ({ column }) => <DataTableColumnHeader column={column} title="Timestamp" />,
//       cell: ({ row }) => {
//         const timestamp = row.getValue("createdAt") as string
//         // Format the timestamp for display
//         const date = new Date(timestamp?.replace(" ", "T"))
//         return <div>{format(date, "MMM dd, yyyy HH:mm:ss")}</div>
//       },
//     },
//     {
//       accessorKey: "fridgeName",
//       header: ({ column }) => <DataTableColumnHeader column={column} title="Fridge" />,
//       cell: ({ row }) => <div className="font-medium">{row.getValue("fridgeID.name")}</div>,
//     },
//     {
//       accessorKey: "roomTemperature",
//       header: ({ column }) => <DataTableColumnHeader column={column} title="Room Temp" />,
//       cell: ({ row }) => {
//         const temp = row.getValue("roomtemp") as number
//         return (
//           <div className="flex items-center">
//             <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
//             <span>{temp?.toFixed(1)} °C</span>
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: "roomHumidity",
//       header: ({ column }) => <DataTableColumnHeader column={column} title="Room Humidity" />,
//       cell: ({ row }) => {
//         const humidity = row.getValue("roomhum") as number
//         return (
//           <div className="flex items-center">
//             <Droplet className="mr-2 h-4 w-4 text-blue-500" />
//             <span>{humidity?.toFixed(1)}%</span>
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: "fridgeTemperature",
//       header: ({ column }) => <DataTableColumnHeader column={column} title="Fridge Temp" />,
//       cell: ({ row }) => {
//         const temp = row.getValue("fridgetemp") as number
//         return (
//           <div className="flex items-center">
//             <Thermometer className="mr-2 h-4 w-4 text-red-500" />
//             <span>{temp.toFixed(1)} °C</span>
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: "fridgeHumidity",
//       header: ({ column }) => <DataTableColumnHeader column={column} title="Fridge Humidity" />,
//       cell: ({ row }) => {
//         const humidity = row.getValue("fridgeHumidity") as number
//         return (
//           <div className="flex items-center">
//             <Droplet className="mr-2 h-4 w-4 text-red-500" />
//             <span>{humidity.toFixed(1)}%</span>
//           </div>
//         )
//       },
//     },
//   ]

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//     },
//     initialState: {
//       pagination: {
//         pageSize: 10,
//       },
//     },
//   })

//   // Function to render status badge
//   const renderStatusBadge = (status: string) => {
//     switch (status) {
//       case "normal":
//         return (
//           <Badge className="bg-green-500">
//             <CheckCircle className="mr-1 h-3 w-3" /> Normal
//           </Badge>
//         )
//       case "warning":
//         return (
//           <Badge className="bg-yellow-500">
//             <AlertTriangle className="mr-1 h-3 w-3" /> Warning
//           </Badge>
//         )
//       case "critical":
//         return (
//           <Badge className="bg-red-500">
//             <AlertTriangle className="mr-1 h-3 w-3" /> Critical
//           </Badge>
//         )
//       default:
//         return <Badge>Unknown</Badge>
//     }
//   }

//   // Function to format timestamp
//   const formatTimestamp = (timestamp: string) => {
//     const date = new Date(timestamp.replace(" ", "T"))
//     return format(date, "MMM dd, yyyy HH:mm:ss")
//   }

//   return (
//     <div className="space-y-4">

//       {isMobile ? (
//         <div className="space-y-4">
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <Card key={row.id} className="overflow-hidden">
//                 <CardContent className="p-0">
//                   <div className="p-4 border-b bg-muted/20">
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-medium">{row.getValue("fridgeName")}</h3>
//                       {renderStatusBadge(row.getValue("status"))}
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-1">{formatTimestamp(row.getValue("timestamp"))}</p>
//                   </div>
//                   <div className="p-4 grid grid-cols-2 gap-3">
//                     <div className="space-y-1">
//                       <p className="text-xs text-muted-foreground">Room Temperature</p>
//                       <div className="flex items-center">
//                         <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
//                         <span>{(row.getValue("roomTemperature") as number).toFixed(1)} °C</span>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-xs text-muted-foreground">Room Humidity</p>
//                       <div className="flex items-center">
//                         <Droplet className="mr-2 h-4 w-4 text-blue-500" />
//                         <span>{(row.getValue("roomHumidity") as number).toFixed(1)}%</span>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-xs text-muted-foreground">Fridge Temperature</p>
//                       <div className="flex items-center">
//                         <Thermometer className="mr-2 h-4 w-4 text-red-500" />
//                         <span>{(row.getValue("fridgeTemperature") as number).toFixed(1)} °C</span>
//                       </div>
//                     </div>
//                     <div className="space-y-1">
//                       <p className="text-xs text-muted-foreground">Fridge Humidity</p>
//                       <div className="flex items-center">
//                         <Droplet className="mr-2 h-4 w-4 text-red-500" />
//                         <span>{(row.getValue("fridgeHumidity") as number).toFixed(1)}%</span>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <Card className="p-6 text-center text-muted-foreground">{emptyMessage}</Card>
//           )}
//         </div>
//       ) : (
//         // Desktop table view
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => {
//                     return (
//                       <TableHead key={header.id}>
//                         {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                       </TableHead>
//                     )
//                   })}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow key={row.id}>
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={columns.length} className="h-24 text-center">
//                     {emptyMessage}
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       <DataTablePagination table={table} />
//     </div>
//   )
// }



"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Thermometer, Droplet } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

interface LogsDataTableProps {
  data: Logs[];
  emptyMessage?: string;
}

export function LogsDataTable({ data, emptyMessage = "No results found." }: LogsDataTableProps) {
  
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if ((page + 1) * pageSize < data.length) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="space-y-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((log) => (
              <Card key={log._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-medium">{log.fridgeID.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(log.createdAt.replace(" ", "T")), "MMM dd, yyyy HH:mm:ss")}
                    </p>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Room Temperature</p>
                      <div className="flex items-center">
                        <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{log.roomtemp.toFixed(1)} °C</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Room Humidity</p>
                      <div className="flex items-center">
                        <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{log.roomhum.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fridge Temperature</p>
                      <div className="flex items-center">
                        <Thermometer className="mr-2 h-4 w-4 text-red-500" />
                        <span>{log.fridgetemp.toFixed(1)} °C</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fridge Humidity</p>
                      <div className="flex items-center">
                        <Droplet className="mr-2 h-4 w-4 text-red-500" />
                        <span>{log.fridgehum.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-6 text-center text-muted-foreground">{emptyMessage}</Card>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Fridge</TableHead>
                <TableHead>Room Temp</TableHead>
                <TableHead>Room Humidity</TableHead>
                <TableHead>Fridge Temp</TableHead>
                <TableHead>Fridge Humidity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{format(new Date(log.createdAt.replace(" ", "T")), "MMM dd, yyyy HH:mm:ss")}</TableCell>
                    <TableCell>{log.fridgeID.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{log.roomtemp.toFixed(1)} °C</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                        <span>{log.roomhum.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Thermometer className="mr-2 h-4 w-4 text-red-500" />
                        <span>{log.fridgetemp.toFixed(1)} °C</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Droplet className="mr-2 h-4 w-4 text-red-500" />
                        <span>{log.fridgehum.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={page === 0}>
          Previous
        </Button>
        <p>Page {page + 1}</p>
        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={(page + 1) * pageSize >= data.length}>
          Next
        </Button>
      </div>
    </div>
  );
}