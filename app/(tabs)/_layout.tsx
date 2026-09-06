import { Tabs } from "expo-router";
import { Briefcase, Building2, Users, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#ffffff" : "#09090b",
        tabBarInactiveTintColor: isDark ? "#a1a1aa" : "#71717a",
        tabBarStyle: {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          borderTopColor: isDark ? "#27272a" : "#e4e4e7",
        },
      }}
    >
      <Tabs.Screen
        name="vacancies"
        options={{
          title: "Vacancies",
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="companies"
        options={{
          title: "Companies",
          tabBarIcon: ({ color }) => <Building2 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="candidates"
        options={{
          title: "Candidates",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
