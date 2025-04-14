"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimeRangeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const timeRanges = [
    { label: "24h", value: "24h" },
    { label: "7d", value: "7d" },
    { label: "30d", value: "30d" },
  ]

  return (
    <div className="flex items-center space-x-1 rounded-md border p-1">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(range.value)}
          className={cn(
            "text-sm",
            value === range.value && "bg-[#3a86fe] text-white hover:bg-[#3a86fe] hover:text-white",
          )}
        >
          {range.label}
        </Button>
      ))}
    </div>
  )
}
