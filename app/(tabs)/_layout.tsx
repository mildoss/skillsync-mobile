import { View, TouchableOpacity, Text, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Briefcase, Building2, Users, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";

const TAB_ICONS: Record<string, typeof Briefcase> = {
  vacancies: Briefcase,
  companies: Building2,
  candidates: Users,
  profile: User,
};

function LiquidGlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const activeColor = isDark ? "#ffffff" : "#09090b";
  const inactiveColor = isDark ? "#71717a" : "#a1a1aa";

  return (
    <View
      style={{
        position: "absolute",
        bottom: Platform.OS === "ios" ? insets.bottom - 16 : insets.bottom + 8,
        left: 16,
        right: 16,
        borderRadius: 28,
        overflow: "hidden",
      }}
    >
      <BlurView
        intensity={80}
        tint={isDark ? "dark" : "light"}
        blurMethod={Platform.OS === "android" ? "none" : undefined}
        style={{
          borderRadius: 28,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 20,
            right: 20,
            height: 1,
            backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)",
            borderRadius: 1,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingVertical: 10,
            paddingHorizontal: 8,
            backgroundColor: isDark ? "rgba(18, 18, 24, 0.45)" : "rgba(255, 255, 255, 0.35)",
            borderWidth: 1,
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            borderRadius: 28,
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = (options.title ?? route.name) as string;
            const isFocused = state.index === index;
            const IconComponent = TAB_ICONS[route.name] ?? Briefcase;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 4,
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 34,
                    borderRadius: 17,
                    overflow: "hidden",
                    backgroundColor: isFocused
                      ? isDark
                        ? "#6366f140"
                        : "#4f46e526"
                      : "transparent",
                  }}
                >
                  <IconComponent
                    size={20}
                    color={isFocused ? (isDark ? "#818cf8" : "#4f46e5") : inactiveColor}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: isFocused ? "600" : "400",
                    color: isFocused ? activeColor : inactiveColor,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <LiquidGlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="vacancies"
        options={{
          title: "Vacancies",
        }}
      />
      <Tabs.Screen
        name="companies"
        options={{
          title: "Companies",
        }}
      />
      <Tabs.Screen
        name="candidates"
        options={{
          title: "Candidates",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
