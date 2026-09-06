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
      pathname: "/(tabs)/",
      params: { skills: skillId },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 bg-card rounded-lg border border-border p-4 shadow-sm"
    >
      <View className="mb-4 flex-row justify-between">
        <View className="flex-row flex-1 gap-3">
          <CustomAvatar
            imageUrl={vacancy.company.logoUrl}
            fallbackText={vacancy.company.name}
            size="sm"
          />
          <View className="flex-1 justify-center">
            <Text className="text-primary text-lg font-semibold" numberOfLines={2}>
              {vacancy.title}
            </Text>
            <View className="mt-1 flex-row items-center flex-wrap">
              <Text className="text-muted-foreground text-sm font-medium">
                {vacancy.company.name}
              </Text>
              <Text className="text-muted-foreground text-xs mx-2">•</Text>
              <Text className="text-muted-foreground text-xs">
                {formatDate(vacancy.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-end pl-2">
          <Text className="text-success text-base font-bold">
            {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row flex-wrap gap-x-2 gap-y-1">
        <Text className="text-foreground text-sm font-semibold">
          {formatEnum(vacancy.type)}
        </Text>
        {vacancy.location && (
          <Text className="text-muted-foreground text-sm">
            · {formatEnum(vacancy.location)}
          </Text>
        )}
        <Text className="text-muted-foreground text-sm">
          · {formatExperience(vacancy.experience)}
        </Text>
        {vacancy.category && (
          <Text className="text-muted-foreground text-sm">
            · {vacancy.category.name}
          </Text>
        )}
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {vacancy.skills.map((skill) => (
          <Pressable key={skill.id} onPress={() => handleSkillPress(skill.id)}>
            <Badge variant="secondary">{skill.name}</Badge>
          </Pressable>
        ))}
      </View>

      <Text className="text-foreground text-sm" numberOfLines={3}>
        {vacancy.description}
      </Text>
    </Pressable>
  );
};
