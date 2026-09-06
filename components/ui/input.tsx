import * as React from "react";
import { TextInput, TextInputProps } from "react-native";

import { cn } from "@/lib/utils";

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderTextColor, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "h-10 rounded-lg border border-input bg-transparent px-3 text-base text-foreground lg:text-sm",
          className
        )}
        placeholderTextColor={
          placeholderTextColor ?? "#a1a1aa" // default placeholder color for dark/light (can be adjusted via tailwind classes in NativeWind v4, but standard prop is safe)
        }
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
