import React from "react";
import { View, Text } from "react-native";

export interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </Text>
      <View className="rounded-xl border border-border/50 bg-card p-4 shadow-sm">{children}</View>
    </View>
  );
}
