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

interface EnvironmentalGraphProps {
  data: LatestLog[];
  type: "room" | "fridge";
}

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

export function EnvironmentalGraph({ data, type }: EnvironmentalGraphProps) {

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

  // Determine temperature domain based on type
  const getTemperatureDomain = () => {
    if (type === "fridge") {
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

          {type === "room" && (
            <>
              <p className="text-sm text-green-500">Temperature: {payload[0].value.toFixed(1)}°C</p>
              <p className="text-sm text-orange-500">Humidity: {payload[1].value.toFixed(1)}%</p>
            </>
          )}

          {type === "fridge" && (
            <>
              <p className="text-sm text-gray-500">Temperature: {payload[0].value.toFixed(1)}°C</p>
              <p className="text-sm text-blue-500">Humidity: {payload[1].value.toFixed(1)}%</p>
            </>
          )}
        </Card>
      );
    }
    return null;
  };

  //Data for the chart.
  const chartData = data.map((item) => ({
    time: item.createdAt,
    temperature: type === "fridge" ? item.fridgetemp : item.roomtemp,
    humidity: type === "fridge" ? item.fridgehum : item.roomhum,
  }));

  return (
    <div className="space-y-4">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickFormatter={formatTimeLabel} tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="temperature"
              domain={getTemperatureDomain()}
              tickFormatter={(value) => `${value}°C`}
              tick={{ fontSize: 12 }}
              orientation="left"
              stroke={type === "room" ? "#136F63" : "#435058"}
            />
            <YAxis
              yAxisId="humidity"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
              orientation="right"
              stroke={type === "room" ? "#136F63" : "#435058"}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke={type === "room" ? "#136F63" : "#435058"}
              fill={type === "room" ? "#136F63" : "#435058"}
              strokeWidth={2}
              yAxisId="temperature"
              name="Temperature"
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke={type === "room" ? "#F34213" : "#1446A0"}
              fill={type === "room" ? "#F34213" : "#1446A0"}
              strokeWidth={2}
              yAxisId="humidity"
              name="Humidity"
              dot={{ r: 2 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}