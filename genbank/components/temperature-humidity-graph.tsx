// "use client"

// import { useState } from "react"
// import {
//   Area,
//   AreaChart,
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ReferenceArea,
//   ReferenceLine,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts"
// import { Card } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// interface TemperatureHumidityGraphProps {
//   data: Log[];
//   showOnly?: "temperature" | "humidity"
//   thresholds?: {
//     temperature?: { min: number; max: number }
//     humidity?: { min: number; max: number }
//   }
//   isFridge?: boolean
// }


// interface Log {
//   _id: string;
//   fridgeID: string;
//   roomtemp: number;
//   roomhum: number;
//   fridgetemp: number;
//   fridgehum: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export function TemperatureHumidityGraph({
//   data,
//   showOnly,
//   thresholds,
//   isFridge = false,
// }: TemperatureHumidityGraphProps) {
//   const [graphType, setGraphType] = useState<"line" | "area">("line")

//   if (!data ||  data.length=== 0) {
//     return (
//       <div className="flex h-[300px] items-center justify-center rounded-md bg-gray-100">
//         <p className="text-muted-foreground">No data available</p>
//       </div>
//     )
//   }

//   // Format the time label based on the time range
//   const formatTimeLabel = (time: string) => {
 
//       return time
//   }

//   // Determine temperature domain based on fridge or room
//   const getTemperatureDomain = () => {
//     if (isFridge) {
//       // For fridges (negative temperatures)
//       const minTemp = Math.min(...data.map((d) => d.fridgetemp)) - 5
//       const maxTemp = Math.max(...data.map((d) => d.fridgetemp)) + 5
//       return [minTemp, maxTemp]
//     } else {
//       // For room (positive temperatures)
//       const minTemp = Math.min(...data.map((d) => d.fridgetemp)) - 2
//       const maxTemp = Math.max(...data.map((d) => d.fridgetemp)) + 2
//       return [minTemp, maxTemp]
//     }
//   }

//   // Custom tooltip component
//   const CustomTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <Card className="p-2 shadow-md border bg-white">
//           <p className="text-sm font-medium">{formatTimeLabel(label)}</p>
//           {(!showOnly || showOnly === "temperature") && (
//             <p className="text-sm text-[#ef4444]">Temperature: {payload[0].value.toFixed(1)}°C</p>
//           )}
//           {(!showOnly || showOnly === "humidity") && (
//             <p className="text-sm text-[#3a86fe]">Humidity: {payload[showOnly ? 0 : 1].value.toFixed(1)}%</p>
//           )}
//         </Card>
//       )
//     }
//     return null
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <Tabs defaultValue="line" className="w-[200px]" onValueChange={(v) => setGraphType(v as "line" | "area")}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="line">Line</TabsTrigger>
//             <TabsTrigger value="area">Area</TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className="h-[300px] w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           {graphType === "line" ? (
//             <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis dataKey="time" tickFormatter={formatTimeLabel} tick={{ fontSize: 12 }} />

//               {(!showOnly || showOnly === "temperature") && (
//                 <YAxis
//                   yAxisId="temperature"
//                   domain={getTemperatureDomain()}
//                   tickFormatter={(value) => `${value}°C`}
//                   tick={{ fontSize: 12 }}
//                   orientation="left"
//                 />
//               )}

//               {(!showOnly || showOnly === "humidity") && (
//                 <YAxis
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   domain={[0, 100]}
//                   tickFormatter={(value) => `${value}%`}
//                   tick={{ fontSize: 12 }}
//                   orientation="right"
//                 />
//               )}

//               <Tooltip content={<CustomTooltip />} />
//               <Legend />

//               {/* Temperature threshold reference areas */}
//               {thresholds?.temperature && !showOnly && (
//                 <ReferenceArea
//                   y1={thresholds.temperature.min}
//                   y2={thresholds.temperature.max}
//                   yAxisId="temperature"
//                   fill="#ef444420"
//                   fillOpacity={0.2}
//                 />
//               )}

//               {/* Humidity threshold reference areas */}
//               {thresholds?.humidity && !showOnly && (
//                 <ReferenceArea
//                   y1={thresholds.humidity.min}
//                   y2={thresholds.humidity.max}
//                   yAxisId="humidity"
//                   fill="#3a86fe20"
//                   fillOpacity={0.2}
//                 />
//               )}

//               {/* Temperature threshold lines */}
//               {thresholds?.temperature?.min && (showOnly === "temperature" || !showOnly) && (
//                 <ReferenceLine
//                   y={thresholds.temperature.min}
//                   yAxisId="temperature"
//                   stroke="#ef4444"
//                   strokeDasharray="3 3"
//                   label={{ value: `Min: ${thresholds.temperature.min}°C`, position: "insideBottomLeft", fontSize: 10 }}
//                 />
//               )}

//               {thresholds?.temperature?.max && (showOnly === "temperature" || !showOnly) && (
//                 <ReferenceLine
//                   y={thresholds.temperature.max}
//                   yAxisId="temperature"
//                   stroke="#ef4444"
//                   strokeDasharray="3 3"
//                   label={{ value: `Max: ${thresholds.temperature.max}°C`, position: "insideTopLeft", fontSize: 10 }}
//                 />
//               )}

//               {/* Humidity threshold lines */}
//               {thresholds?.humidity?.min && (showOnly === "humidity" || !showOnly) && (
//                 <ReferenceLine
//                   y={thresholds.humidity.min}
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   stroke="#3a86fe"
//                   strokeDasharray="3 3"
//                   label={{ value: `Min: ${thresholds.humidity.min}%`, position: "insideBottomRight", fontSize: 10 }}
//                 />
//               )}

//               {thresholds?.humidity?.max && (showOnly === "humidity" || !showOnly) && (
//                 <ReferenceLine
//                   y={thresholds.humidity.max}
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   stroke="#3a86fe"
//                   strokeDasharray="3 3"
//                   label={{ value: `Max: ${thresholds.humidity.max}%`, position: "insideTopRight", fontSize: 10 }}
//                 />
//               )}

//               {/* Temperature line */}
//               {(!showOnly || showOnly === "temperature") && (
//                 <Line
//                   type="monotone"
//                   dataKey="temperature"
//                   stroke="#ef4444"
//                   strokeWidth={2}
//                   yAxisId="temperature"
//                   name="Temperature"
//                   dot={{ r: 2 }}
//                   activeDot={{ r: 5 }}
//                 />
//               )}

//               {/* Humidity line */}
//               {(!showOnly || showOnly === "humidity") && (
//                 <Line
//                   type="monotone"
//                   dataKey="humidity"
//                   stroke="#3a86fe"
//                   strokeWidth={2}
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   name="Humidity"
//                   dot={{ r: 2 }}
//                   activeDot={{ r: 5 }}
//                 />
//               )}
//             </LineChart>
//           ) : (
//             <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis dataKey="time" tickFormatter={formatTimeLabel} tick={{ fontSize: 12 }} />

//               {(!showOnly || showOnly === "temperature") && (
//                 <YAxis
//                   yAxisId="temperature"
//                   domain={getTemperatureDomain()}
//                   tickFormatter={(value) => `${value}°C`}
//                   tick={{ fontSize: 12 }}
//                   orientation="left"
//                 />
//               )}

//               {(!showOnly || showOnly === "humidity") && (
//                 <YAxis
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   domain={[0, 100]}
//                   tickFormatter={(value) => `${value}%`}
//                   tick={{ fontSize: 12 }}
//                   orientation="right"
//                 />
//               )}

//               <Tooltip content={<CustomTooltip />} />
//               <Legend />

//               {/* Temperature threshold reference areas */}
//               {thresholds?.temperature && (showOnly === "temperature" || !showOnly) && (
//                 <ReferenceArea
//                   y1={thresholds.temperature.min}
//                   y2={thresholds.temperature.max}
//                   yAxisId="temperature"
//                   fill="#ef444420"
//                   fillOpacity={0.2}
//                 />
//               )}

//               {/* Humidity threshold reference areas */}
//               {thresholds?.humidity && (showOnly === "humidity" || !showOnly) && (
//                 <ReferenceArea
//                   y1={thresholds.humidity.min}
//                   y2={thresholds.humidity.max}
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   fill="#3a86fe20"
//                   fillOpacity={0.2}
//                 />
//               )}

//               {/* Temperature area */}
//               {(!showOnly || showOnly === "temperature") && (
//                 <Area
//                   type="monotone"
//                   dataKey="temperature"
//                   stroke="#ef4444"
//                   fill="#ef444420"
//                   strokeWidth={2}
//                   yAxisId="temperature"
//                   name="Temperature"
//                   dot={{ r: 2 }}
//                   activeDot={{ r: 5 }}
//                 />
//               )}

//               {/* Humidity area */}
//               {(!showOnly || showOnly === "humidity") && (
//                 <Area
//                   type="monotone"
//                   dataKey="humidity"
//                   stroke="#3a86fe"
//                   fill="#3a86fe20"
//                   strokeWidth={2}
//                   yAxisId={showOnly ? "temperature" : "humidity"}
//                   name="Humidity"
//                   dot={{ r: 2 }}
//                   activeDot={{ r: 5 }}
//                 />
//               )}
//             </AreaChart>
//           )}
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }



"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemperatureHumidityGraphProps {
  data: Log[];
  isFridge?: boolean;
}

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

export function TemperatureHumidityGraph({
  data,
  isFridge = false,
}: TemperatureHumidityGraphProps) {
  const [graphType, setGraphType] = useState<"line" | "area">("area"); // Default to area chart

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-md bg-gray-100">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Format the time label
  const formatTimeLabel = (time: string) => {
    return new Date(time).toLocaleTimeString(); // Simple time formatting
  };

  // Determine temperature domain based on fridge or room
  const getTemperatureDomain = () => {
    if (isFridge) {
      const minTemp = Math.min(...data.map((d) => d.fridgetemp)) - 5;
      const maxTemp = Math.max(...data.map((d) => d.fridgetemp)) + 5;
      return [minTemp, maxTemp];
    } else {
      const minTemp = Math.min(...data.map((d) => d.roomtemp)) - 2;
      const maxTemp = Math.max(...data.map((d) => d.roomtemp)) + 2;
      return [minTemp, maxTemp];
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-2 shadow-md border bg-white">
          <p className="text-sm font-medium">{formatTimeLabel(label)}</p>
          <p className="text-sm text-[#DF2935]">
            Temperature: {payload[0].value.toFixed(1)}°C
          </p>
          <p className="text-sm text-[#3772FF]">
            Humidity: {payload[1].value.toFixed(1)}%
          </p>
        </Card>
      );
    }
    return null;
  };

  //Data for the chart.
  const chartData = data.map((item) => ({
    time: item.createdAt,
    temperature: isFridge ? item.fridgetemp : item.roomtemp,
    humidity: isFridge ? item.fridgehum : item.roomhum,
  }));

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {graphType === "line" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatTimeLabel} tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="temperature"
                domain={getTemperatureDomain()}
                tickFormatter={(value) => `${value}°C`}
                tick={{ fontSize: 12 }}
                orientation="left"
              />
              <YAxis
                yAxisId="humidity"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#DF2935"
                fill="#DF2935"
                strokeWidth={2}
                yAxisId="temperature"
                name="Temperature"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#3772FF"
                fill="#3772FF"
                strokeWidth={2}
                yAxisId="humidity"
                name="Humidity"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tickFormatter={formatTimeLabel} tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="temperature"
                domain={getTemperatureDomain()}
                tickFormatter={(value) => `${value}°C`}
                tick={{ fontSize: 12 }}
                orientation="left"
              />
              <YAxis
                yAxisId="humidity"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#DF2935"
                fill="#DF2935"
                strokeWidth={2}
                yAxisId="temperature"
                name="Temperature"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="#3772FF"
                fill="#3772FF"
                strokeWidth={2}
                yAxisId="humidity"
                name="Humidity"
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}