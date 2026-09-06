import React from "react";
import { Pressable, View } from "react-native";
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
        "h-5 w-5 rounded-sm border items-center justify-center",
        checked
          ? "bg-primary border-primary"
          : "bg-transparent border-input",
        className
      )}
    >
      {checked && <Check size={14} color={isDark ? "#09090b" : "#ffffff"} />}
    </Pressable>
  );
}
