import React from "react";
import { View, Text, Pressable } from "react-native";
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterCheckboxGroupProps {
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterCheckboxGroup({
  options,
  selectedValues,
  onChange,
}: FilterCheckboxGroupProps) {
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <View className="space-y-3">
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => toggleOption(option.value)}
          className="flex-row items-center"
        >
          <Checkbox
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => toggleOption(option.value)}
          />
          <Text className="ml-3 text-sm text-foreground">{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
