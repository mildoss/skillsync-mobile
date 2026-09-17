import { View, Text, Pressable } from "react-native";
import { Input } from "@/components/ui/input";
import { Filter, Search, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface SearchHeaderProps {
  title: string;
  subtitle: string;
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onFilterPress?: () => void;
  filterCount?: number;
}

export const SearchHeader = ({
  title,
  subtitle,
  placeholder,
  searchQuery,
  setSearchQuery,
  onSubmit,
  onClear,
  onFilterPress,
  filterCount = 0,
}: SearchHeaderProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="border-b border-border/40 px-4 pb-3 pt-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </Text>
          <Text className="my-0.5 text-sm text-muted-foreground">{subtitle}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <NotificationBell />
          {onFilterPress && (
            <Pressable
              onPress={onFilterPress}
              className="relative h-11 w-11 items-center justify-center rounded-xl bg-primary/10"
            >
              <Filter size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
              {filterCount > 0 ? (
                <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-destructive">
                  <Text className="text-[10px] font-bold text-destructive-foreground">
                    {filterCount}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          )}
        </View>
      </View>

      <View className="relative mt-3">
        <View className="absolute left-3 top-3 z-10">
          <Search size={20} color={isDark ? "#a1a1aa" : "#71717a"} />
        </View>
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          className="h-12 border-border bg-card pl-10 pr-10"
          placeholderTextColor={isDark ? "#a1a1aa" : "#71717a"}
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={onClear}
            className="absolute right-3 top-3.5 z-10"
            hitSlop={8}
          >
            <X size={18} color={isDark ? "#a1a1aa" : "#71717a"} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
