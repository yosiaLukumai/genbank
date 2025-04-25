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
  // page: number;
  // setPage: React.Dispatch<React.SetStateAction<number>>;
  // data for pagination
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