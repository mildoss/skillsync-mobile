import { View, Text } from "react-native";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "minimal";
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) => {
  return (
    <View
      className={cn(
        "items-center justify-center p-10 text-center",
        variant === "default" && "rounded-3xl border border-dashed border-border bg-card",
        variant === "minimal" && "py-12",
        className,
      )}
    >
      <View
        className={cn(
          "mb-4 rounded-full p-4",
          variant === "default" ? "bg-primary/10" : "mb-2 bg-transparent p-0",
        )}
      >
        {icon}
      </View>
      <Text
        className={cn("font-bold text-foreground", variant === "default" ? "text-lg" : "text-xl")}
      >
        {title}
      </Text>
      <Text
        className={cn(
          "mt-1 text-center text-muted-foreground",
          variant === "default" ? "mb-6 text-sm leading-relaxed" : "mt-2",
        )}
      >
        {description}
      </Text>
      {action && <View>{action}</View>}
    </View>
  );
};
