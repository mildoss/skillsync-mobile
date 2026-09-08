import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Companies } from "@/types/companies";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users } from "lucide-react-native";
import { useColorScheme } from "nativewind";

interface CompanyCardProps {
  company: Companies;
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    router.push(`/companies/${company.slug || company.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 bg-card rounded-lg border border-border p-4 shadow-sm active:opacity-80"
    >
      <View className="mb-4 flex-row items-start gap-4">
        <CustomAvatar
          imageUrl={company.logoUrl}
          fallbackText={company.name}
          size="md"
        />
        <View className="flex-1">
          <Text className="text-primary text-lg font-bold leading-tight" numberOfLines={1}>
            {company.name}
          </Text>
          <View className="mt-2 self-start">
            <Badge variant="secondary">
              {company.companyType}
            </Badge>
          </View>
        </View>
      </View>

      <Text className="text-muted-foreground text-sm leading-relaxed mb-4" numberOfLines={2}>
        {company.description || "No description provided."}
      </Text>

      <View className="flex-row items-center gap-4 border-t border-border pt-4">
        <View className="flex-row items-center gap-1.5">
          <Briefcase size={16} color={isDark ? "#a1a1aa" : "#71717a"} />
          <Text className={`text-sm font-medium ${company._count.vacancies > 0 ? 'text-success' : 'text-muted-foreground'}`}>
            {company._count.vacancies} vacancies
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Users size={16} color={isDark ? "#a1a1aa" : "#71717a"} />
          <Text className="text-sm font-medium text-muted-foreground">
            {company._count.employees} employees
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
