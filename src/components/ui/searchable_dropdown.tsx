"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InterestType } from "@/lib/interests"

export function SearchableDropdown({ interests, category, setCategory }: {
  interests: InterestType[],
  category: string,
  setCategory: (pickedTag: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-[50px] hover:text-white input"
        >
          {category
            ? interests.find((interest: InterestType) => interest.interest === category)?.category
            : "Select interest..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
        <Command className="scrollbar">
          <CommandInput className="" placeholder="Search interests..." />
          <CommandList>
            <CommandEmpty>No interest found.</CommandEmpty>
            <CommandGroup>
              {interests.map((interest: InterestType) => (
                <CommandItem
                  className="hover:text-white"
                  key={interest.category}
                  value={interest.category}
                  onSelect={(currentValue) => {
                    setCategory(currentValue === category ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      category === interest.category ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {interest.category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
