"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ComboboxItem = {
  value: string;
  label: string;
};

export interface ComboboxProps {
  items: ComboboxItem[];
  placeholder: string;
  onSelect?: (value: string) => void;
  defaultValue?: string;
  disableSearch?: boolean;
  emptyMessage?: string;
  width?: string;
  height?: string;
  className?: string;
}

export function Combobox({
  items,
  placeholder,
  emptyMessage = "No results found.",
  onSelect,
  defaultValue,
  disableSearch = false,
  width = "200px",
  height = "40px",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? "");

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    onSelect?.(newValue);
    setOpen(false);
  };

  const buttonStyle = {
    width,
    height,
  };

  const popoverStyle = {
    width,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
          style={buttonStyle}
        >
          <span className="text-muted-foreground mr-2">{placeholder}: </span>
          <span>{value && items.find((item) => item.value === value)?.label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={popoverStyle}>
        <Command>
          {!disableSearch && (
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          )}
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem key={item.value} value={item.value} onSelect={handleSelect}>
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
