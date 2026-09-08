import React from "react";
import { Pressable } from "react-native";
import { Check } from "lucide-react-native";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, className }: CheckboxProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      onPress={() => onCheckedChange(!checked)}
      className={cn(
        "h-5 w-5 items-center justify-center rounded-sm border",
        checked ? "border-primary bg-primary" : "border-input bg-transparent",
        className,
      )}
    >
      {checked && <Check size={14} color={isDark ? "#09090b" : "#ffffff"} />}
    </Pressable>
  );
}
