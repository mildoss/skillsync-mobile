import { View, Text, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Vacancy } from "@/types/vacancies";
import { formatSalary, formatExperience, formatDate, formatEnum } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { MoreHorizontal } from "lucide-react-native";

type VacancyCardProps = {
  vacancy: Vacancy;
  onActionPress?: () => void;
  isActionLoading?: boolean;
};

export const VacancyCard = ({ vacancy, onActionPress, isActionLoading }: VacancyCardProps) => {
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
      className="mb-4 rounded-xl border border-border bg-card p-4 shadow-sm"
    >
      <View className="mb-4 flex-row justify-between">
        <View className="flex-1 flex-row gap-3 pr-2">
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

        <View className="items-end justify-start gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-bold text-success">
              {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
            </Text>
            {onActionPress && (
              <TouchableOpacity
                onPress={onActionPress}
                className="rounded-full bg-muted/50 p-1.5"
                disabled={isActionLoading}
              >
                {isActionLoading ? (
                  <ActivityIndicator size="small" color="#64748b" />
                ) : (
                  <MoreHorizontal size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            )}
          </View>
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
