import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/users";
import { formatEnum, formatExperience } from "@/lib/utils";

interface CandidateCardProps {
  candidate: User;
}

export const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/candidates/${candidate.id}`);
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
      className="mb-4 bg-card rounded-lg border border-border p-4 shadow-sm active:opacity-80"
    >
      <View className="mb-4 flex-row items-start gap-4">
        <CustomAvatar
          imageUrl={candidate.avatarUrl}
          fallbackText={candidate.name}
          size="sm"
        />
        <View className="flex-1">
          <Text className="text-primary text-lg font-semibold leading-tight">
            {candidate.position || "Position not specified"}
          </Text>
          <Text className="text-muted-foreground text-sm font-medium mt-1">
            {candidate.name} {candidate.surname}
          </Text>
        </View>
      </View>

      <View className="mb-4 flex-row flex-wrap gap-x-2 gap-y-1">
        {candidate.workFormats && candidate.workFormats.length > 0 && (
          <Text className="text-sm font-semibold text-foreground">
            {candidate.workFormats.map(formatEnum).join(", ")}
          </Text>
        )}

        {candidate.employmentTypes && candidate.employmentTypes.length > 0 && (
          <Text className="text-sm text-muted-foreground">
            · {candidate.employmentTypes.map(formatEnum).join(", ")}
          </Text>
        )}

        {candidate.location && (
          <Text className="text-sm text-muted-foreground">
            · {formatEnum(candidate.location)}
          </Text>
        )}
        
        <Text className="text-sm text-muted-foreground">
          · {formatExperience(candidate.experience?.toString() || null)}
        </Text>
        
        {candidate.category && (
          <Text className="text-sm text-muted-foreground">
            · {candidate.category.name}
          </Text>
        )}
      </View>

      <View className="mb-4 flex-row flex-wrap gap-2">
        {candidate.skills?.map((skill) => (
          <Pressable key={skill.id} onPress={() => handleSkillPress(skill.id)}>
            <Badge variant="secondary">{skill.name}</Badge>
          </Pressable>
        ))}
      </View>

      {candidate.about && (
        <Text 
          className="text-sm text-foreground leading-relaxed" 
          numberOfLines={3}
        >
          {candidate.about}
        </Text>
      )}
    </Pressable>
  );
};
