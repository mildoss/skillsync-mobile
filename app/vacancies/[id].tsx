import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getVacancy } from "@/lib/api";
import { Vacancy } from "@/types/vacancies";
import { formatSalary, formatExperience, formatEnum, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ArrowLeft } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { VacancyDetailsSkeleton } from "@/components/vacancies/VacancyDetailsSkeleton";


export default function VacancyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setIsLoading(true);
        const data = await getVacancy(id);
        setVacancy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load vacancy");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchVacancy();
  }, [id]);

  const handleApply = () => {
    router.push("/(tabs)/profile");
  };

  if (isLoading) {
    return <VacancyDetailsSkeleton />;
  }

  if (error || !vacancy) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-destructive text-lg font-bold mb-4">Failed to load vacancy</Text>
        <Button onPress={() => router.back()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="px-4 pb-3 border-b border-border flex-row items-center"
      >
        <Pressable onPress={() => router.back()} className="mr-4 p-2 -ml-2 rounded-full active:bg-muted">
          <ArrowLeft size={24} color={isDark ? "#ffffff" : "#09090b"} />
        </Pressable>
        <Text className="text-xl font-semibold text-foreground flex-1" numberOfLines={1}>
          {vacancy.title}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-row items-center mb-6">
          <CustomAvatar
            imageUrl={vacancy.company.logoUrl}
            fallbackText={vacancy.company.name}
            size="md"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-foreground">{vacancy.company.name}</Text>
            {vacancy.company.websiteUrl && (
              <Text
                className="text-primary text-sm mt-1"
                onPress={() => Linking.openURL(vacancy.company.websiteUrl!)}
              >
                {vacancy.company.websiteUrl}
              </Text>
            )}
          </View>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-2">{vacancy.title}</Text>
        <Text className="text-success text-xl font-bold mb-4">
          {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
        </Text>

        <View className="mb-6 flex-row flex-wrap gap-2 border-b border-border pb-6">
          <Badge variant="outline">{formatEnum(vacancy.type)}</Badge>
          <Badge variant="outline">{formatExperience(vacancy.experience)}</Badge>
          {vacancy.location && <Badge variant="outline">{formatEnum(vacancy.location)}</Badge>}
          {vacancy.category && <Badge variant="outline">{vacancy.category.name}</Badge>}
        </View>

        <Text className="text-lg font-bold text-foreground mb-2">Description</Text>
        <Text className="text-foreground text-base leading-relaxed mb-6">
          {vacancy.description}
        </Text>

        <Text className="text-xl font-bold text-foreground mb-4">Requirements</Text>

        {vacancy.skills && vacancy.skills.length > 0 && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-foreground mb-2">Skills</Text>
            <View className="flex-row flex-wrap gap-2">
              {vacancy.skills.map((skill) => (
                <Badge key={`skill-${skill.id}`} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
            </View>
          </View>
        )}

        {vacancy.languages && vacancy.languages.length > 0 && (
          <View className="mb-8">
            <Text className="text-base font-semibold text-foreground mb-2">Languages</Text>
            <View className="flex-row flex-wrap gap-2">
              {vacancy.languages.map((lang) => (
                <Badge key={`lang-${lang.id}`} variant="secondary">
                  {lang.name}
                </Badge>
              ))}
            </View>
          </View>
        )}

        <Text className="text-muted-foreground text-sm text-center mb-8">
          Posted on {formatDate(vacancy.createdAt)}
        </Text>
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="px-6 pt-4 bg-background border-t border-border"
      >
        <Button size="lg" onPress={handleApply} className="w-full">
          Apply Now
        </Button>
      </View>
    </View>
  );
}
