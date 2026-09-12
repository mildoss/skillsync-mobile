import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { User } from "@/types/users";
import { UserIcon, Building, Briefcase, Users, CreditCard, FileText } from "lucide-react-native";
import { cssInterop } from "nativewind";

[UserIcon, Building, Briefcase, Users, CreditCard, FileText].forEach((Icon) => {
  cssInterop(Icon, {
    className: { target: "style", nativeStyleToProp: { color: true } },
  });
});

export type TabKey = "profile" | "applications" | "company" | "vacancies" | "team" | "billing";

interface TabItem {
  key: TabKey;
  label: string;
  icon: any;
}

interface ProfileTabsProps {
  user?: User | null;
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
}

export const ProfileTabs = ({ user, activeTab, onChangeTab }: ProfileTabsProps) => {
  if (!user || !user.role) return null;

  const applicantTabs: TabItem[] = [
    { key: "profile", label: "My Profile", icon: UserIcon },
    { key: "billing", label: "Billing", icon: CreditCard },
  ];

  const employerTabs: TabItem[] = [
    { key: "profile", label: "My Profile", icon: UserIcon },
    { key: "company", label: "My Company", icon: Building },
    { key: "vacancies", label: "My Vacancies", icon: Briefcase },
    { key: "billing", label: "Billing", icon: CreditCard },
  ];

  if (user.role === "EMPLOYER" && user.companyRole === "OWNER") {
    employerTabs.splice(employerTabs.length - 1, 0, {
      key: "team",
      label: "My Team",
      icon: Users,
    });
  }

  const tabs = user.role === "APPLICANT" ? applicantTabs : employerTabs;

  return (
    <View className="border-b border-border bg-background">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onChangeTab(tab.key)}
              className={`flex-row items-center gap-2 rounded-full px-4 py-2 transition-colors ${isActive ? "bg-primary" : "bg-muted"
                }`}
            >
              <Icon
                className={isActive ? "text-primary-foreground" : "text-muted-foreground"}
                size={16}
              />
              <Text
                className={`text-sm font-medium ${isActive ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
