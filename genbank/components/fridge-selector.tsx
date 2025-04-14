"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface FridgeSelectorProps {
  fridges: Array<{
    _id: string
    name: string
  }>
  selectedFridgeId: string | null
  onSelect: (fridgeId: string) => void
}

export function FridgeSelector({ fridges, selectedFridgeId, onSelect }: FridgeSelectorProps) {
  const [open, setOpen] = useState(false)

  const selectedFridge = fridges.find((fridge) => fridge._id === selectedFridgeId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full sm:w-[250px] justify-between">
          {selectedFridge ? selectedFridge.name : "Select fridge..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search fridge..." />
          <CommandList>
            <CommandEmpty>No fridge found.</CommandEmpty>
            <CommandGroup>
              {fridges.map((fridge) => (
                <CommandItem
                  key={fridge._id}
                  value={fridge._id}
                  onSelect={() => {
                    onSelect(fridge._id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedFridgeId === fridge._id ? "opacity-100" : "opacity-0")} />
                  {fridge.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
