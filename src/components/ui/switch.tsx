import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  checkedIcon?: React.ReactElement;
  uncheckedIcon?: React.ReactElement;
  size?: SwitchSize;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, checkedIcon, uncheckedIcon, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: {
        switch: "h-4 w-7",
        thumb: "h-3 w-3",
        icon: "text-xs",
        translation: "data-[state=checked]:translate-x-3",
      },
      md: {
        switch: "h-5 w-9",
        thumb: "h-4 w-4",
        icon: "text-sm",
        translation: "data-[state=checked]:translate-x-4",
      },
      lg: {
        switch: "h-6 w-11",
        thumb: "h-5 w-5",
        icon: "text-base",
        translation: "data-[state=checked]:translate-x-5",
      },
    };

    return (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          sizeClasses[size].switch,
          className
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none flex items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
            sizeClasses[size].thumb,
            sizeClasses[size].translation
          )}
        >
          {checkedIcon && uncheckedIcon && (
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                sizeClasses[size].icon
              )}
            >
              {props.checked ? checkedIcon : uncheckedIcon}
            </span>
          )}
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    );
  }
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
