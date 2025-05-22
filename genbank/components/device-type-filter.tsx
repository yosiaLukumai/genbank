"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeviceTypeFilterProps {
  value: string
  onChange: (value: string) => void
}

export function DeviceTypeFilter({ value, onChange }: DeviceTypeFilterProps) {
  const deviceTypes = [
    { label: "All Devices", value: "all" },
    { label: "Room Only", value: "room" },
    { label: "Freezer Only", value: "freezer" },
  ]

  return (
    <div className="flex items-center space-x-1 rounded-md border p-1">
      {deviceTypes.map((type) => (
        <Button
          key={type.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(type.value)}
          className={cn(
            "text-sm",
            value === type.value && "bg-[#3a86fe] text-white hover:bg-[#3a86fe] hover:text-white",
          )}
        >
          {type.label}
        </Button>
      ))}
    </div>
  )
}
