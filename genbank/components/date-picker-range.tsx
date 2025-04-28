// "use client"

// import * as React from "react"
// import { addDays, format } from "date-fns"
// import { Calendar as CalendarIcon } from "lucide-react"
// import { DateRange } from "react-day-picker"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"

// export function DatePickerWithRange({
//     className,
// }: React.HTMLAttributes<HTMLDivElement>) {
//     const [date, setDate] = React.useState<DateRange | undefined>({
//         from: addDays(new Date(), -20),
//         to: addDays(new Date(), 0),
//     })

//     return (
//         <div className={cn("grid gap-2", className)}>
//             <Popover>
//                 <PopoverTrigger asChild>
//                     <Button
//                         id="date"
//                         variant={"outline"}
//                         className={cn(
//                             " justify-start text-left font-normal",
//                             !date && "text-muted-foreground"
//                         )}
//                     >
//                         <CalendarIcon />
//                         {date?.from ? (
//                             date.to ? (
//                                 <>
//                                     {format(date.from, "LLL dd, y")} -{" "}
//                                     {format(date.to, "LLL dd, y")}
//                                 </>
//                             ) : (
//                                 format(date.from, "LLL dd, y")
//                             )
//                         ) : (
//                             <span>Pick a date</span>
//                         )}
//                     </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                         mode="range"
//                         defaultMonth={date?.from}
//                         selected={date}
//                         onSelect={setDate}
//                         numberOfMonths={2}
//                     />
//                 </PopoverContent>
//             </Popover>
//         </div>
//     )
// }


"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  value?: DateRange
  onChange?: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
  className,
  value,
  onChange,
}: DatePickerWithRangeProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    value ?? {
      from: addDays(new Date(), -20),
      to: addDays(new Date(), 0),
    }
  )

  function handleSelect(date: DateRange | undefined) {
    setInternalDate(date)
    onChange?.(date) // fire back to parent
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "LLL dd, y")} -{" "}
                  {format(internalDate.to, "LLL dd, y")}
                </>
              ) : (
                format(internalDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={internalDate?.from}
            selected={internalDate}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
