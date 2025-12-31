"use client";

import * as React from "react";
import { Toggle } from "./toggle";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export interface IconToggleProps {
  icon: string;
  label: string;
  pressed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IconToggle = React.forwardRef<HTMLButtonElement, IconToggleProps>(
  ({ icon, label, pressed = false, onClick, className }, ref) => {
    return (
      <Toggle
        ref={ref}
        pressed={pressed}
        onClick={onClick}
        className={cn(
          "text-xs gap-1.5 h-7",
          pressed && "ring-1 ring-primary",
          className
        )}
      >
        <Icon icon={icon} width={16} height={16} />
        <span>{label}</span>
      </Toggle>
    );
  }
);

IconToggle.displayName = "IconToggle";
