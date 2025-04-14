"use client"
import { ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"

interface TemperatureHumidityChartProps {
  data: Array<{
    time: string
    temperature: number
    humidity: number
  }>
}

export function TemperatureHumidityChart({ data }: TemperatureHumidityChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">No data available</div>
  }

  return (
    <ChartContainer className="h-[300px]">
      <ChartLegend className="mb-2">
        <ChartLegendItem name="Temperature" color="#ef4444" />
        <ChartLegendItem name="Humidity" color="#3a86fe" />
      </ChartLegend>
      <div className="h-full w-full bg-gray-100 rounded-md flex items-center justify-center">
        Chart data available - simplified view
      </div>
    </ChartContainer>
  )
}
