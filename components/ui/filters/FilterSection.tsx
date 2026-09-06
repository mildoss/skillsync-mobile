import React from "react";
import { View, Text } from "react-native";

export interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">{title}</Text>
      <View className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
        {children}
      </View>
    </View>
  );
}
