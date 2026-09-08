import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
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
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="mb-4 text-lg font-bold text-destructive">Failed to load vacancy</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="flex-row items-center border-b border-border px-4 pb-3"
      >
        <Pressable
          onPress={() => router.back()}
          className="-ml-2 mr-4 rounded-full p-2 active:bg-muted"
        >
          <ArrowLeft size={24} color={isDark ? "#ffffff" : "#09090b"} />
        </Pressable>
        <Text className="flex-1 text-xl font-semibold text-foreground" numberOfLines={1}>
          {vacancy.title}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mb-6 flex-row items-center">
          <CustomAvatar
            imageUrl={vacancy.company.logoUrl}
            fallbackText={vacancy.company.name}
            size="md"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-foreground">{vacancy.company.name}</Text>
            {vacancy.company.websiteUrl && (
              <Text
                className="mt-1 text-sm text-primary"
                onPress={() => Linking.openURL(vacancy.company.websiteUrl!)}
              >
                {vacancy.company.websiteUrl}
              </Text>
            )}
          </View>
        </View>

        <Text className="mb-2 text-2xl font-bold text-foreground">{vacancy.title}</Text>
        <Text className="mb-4 text-xl font-bold text-success">
          {formatSalary(vacancy.salaryMin, vacancy.salaryMax, vacancy.currency)}
        </Text>

        <View className="mb-6 flex-row flex-wrap gap-2 border-b border-border pb-6">
          <Badge variant="outline">{formatEnum(vacancy.type)}</Badge>
          <Badge variant="outline">{formatExperience(vacancy.experience)}</Badge>
          {vacancy.location && <Badge variant="outline">{formatEnum(vacancy.location)}</Badge>}
          {vacancy.category && <Badge variant="outline">{vacancy.category.name}</Badge>}
        </View>

        <Text className="mb-2 text-lg font-bold text-foreground">Description</Text>
        <Text className="mb-6 text-base leading-relaxed text-foreground">
          {vacancy.description}
        </Text>

        <Text className="mb-4 text-xl font-bold text-foreground">Requirements</Text>

        {vacancy.skills && vacancy.skills.length > 0 && (
          <View className="mb-4">
            <Text className="mb-2 text-base font-semibold text-foreground">Skills</Text>
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
            <Text className="mb-2 text-base font-semibold text-foreground">Languages</Text>
            <View className="flex-row flex-wrap gap-2">
              {vacancy.languages.map((lang) => (
                <Badge key={`lang-${lang.id}`} variant="secondary">
                  {lang.name}
                </Badge>
              ))}
            </View>
          </View>
        )}

        <Text className="mb-8 text-center text-sm text-muted-foreground">
          Posted on {formatDate(vacancy.createdAt)}
        </Text>
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="border-t border-border bg-background px-6 pt-4"
      >
        <Button size="lg" onPress={handleApply} className="w-full">
          Apply Now
        </Button>
      </View>
    </View>
  );
}
