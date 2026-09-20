import * as React from "react";
import { TextInput, TextInputProps, Platform } from "react-native";
import { cn } from "@/lib/utils";

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, style, placeholderTextColor, multiline, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline={multiline}
        textAlignVertical={
          multiline ? (props.textAlignVertical ?? "top") : (props.textAlignVertical ?? "center")
        }
        style={[
          Platform.OS === "android"
            ? {
              includeFontPadding: false,
              ...(multiline ? {} : { paddingVertical: 0 }),
            }
            : null,
          style,
        ]}
        className={cn(
          "h-10 rounded-lg border border-input bg-transparent px-3 text-base text-foreground lg:text-sm",
          className,
        )}
        placeholderTextColor={placeholderTextColor ?? "#a1a1aa"}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
