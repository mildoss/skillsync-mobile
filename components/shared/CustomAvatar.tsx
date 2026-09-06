import React from "react";
import { View, Text, Image } from "react-native";
import { cn } from "@/lib/utils";

type CustomAvatarProps = {
  imageUrl?: string | null;
  fallbackText: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const CustomAvatar = ({
  imageUrl,
  fallbackText,
  size = "sm",
  className,
}: CustomAvatarProps) => {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const currentSizeClass = sizeClasses[size];
  const currentTextClass = textClasses[size];

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        className={cn("rounded-xl bg-muted", currentSizeClass, className)}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      className={cn(
        "flex items-center justify-center rounded-xl bg-muted-foreground shadow-sm",
        currentSizeClass,
        className,
      )}
    >
      <Text className={cn("font-bold text-white", currentTextClass)}>
        {fallbackText ? fallbackText[0].toUpperCase() : "?"}
      </Text>
    </View>
  );
};
