import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Vacancy } from "@/types/vacancies";
import { formatSalary, formatExperience, formatDate, formatEnum } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/CustomAvatar";

type VacancyCardProps = {
  vacancy: Vacancy;
};

export const VacancyCard = ({ vacancy }: VacancyCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/vacancies/${vacancy.id}`);
  };

  const handleSkillPress = (skillId: string) => {
    router.push({
      pathname: "/(tabs)/vacancies",
      params: { skills: skillId },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm"
    >
      <View className="mb-4 flex-row justify-between">
        <View className="flex-1 flex-row gap-3">
          <CustomAvatar
            imageUrl={vacancy.company.logoUrl}
            fallbackText={vacancy.company.name}
            size="sm"
          />
          <View className="flex-1 justify-center">
            <Text className="text-lg font-semibold text-primary" numberOfLines={2}>
              {vacancy.title}
            </Text>
            <View className="mt-1 flex-row flex-wrap items-center">
              <Text className="text-sm font-medium text-muted-foreground">
                {vacancy.company.name}
              </Text>
              <Text className="mx-2 text-xs text-muted-foreground">•</Text>
              <Text className="text-xs text-muted-foreground">{formatDate(vacancy.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View className="items-end pl-2">
          <Text className="text-base font-bold text-success">
            {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row flex-wrap gap-x-2 gap-y-1">
        <Text className="text-sm font-semibold text-foreground">{formatEnum(vacancy.type)}</Text>
        {vacancy.location && (
          <Text className="text-sm text-muted-foreground">· {formatEnum(vacancy.location)}</Text>
        )}
        <Text className="text-sm text-muted-foreground">
          · {formatExperience(vacancy.experience)}
        </Text>
        {vacancy.category && (
          <Text className="text-sm text-muted-foreground">· {vacancy.category.name}</Text>
        )}
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {vacancy.skills.map((skill) => (
          <Pressable key={skill.id} onPress={() => handleSkillPress(skill.id)}>
            <Badge variant="secondary">{skill.name}</Badge>
          </Pressable>
        ))}
      </View>

      <Text className="text-sm text-foreground" numberOfLines={3}>
        {vacancy.description}
      </Text>
    </Pressable>
  );
};
