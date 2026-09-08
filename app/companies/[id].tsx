import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCompany } from "@/lib/api";
import { CompanyDetail } from "@/types/companies";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Briefcase, Users } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { VacancyCard } from "@/components/vacancies/VacancyCard";
import { CompanyDetailsSkeleton } from "@/components/companies/CompanyDetailsSkeleton";

export default function CompanyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        if (!id) return;
        const data = await getCompany(id);
        if (isMounted) {
          setCompany(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load company");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <CompanyDetailsSkeleton />;
  }

  if (error || !company) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 items-center justify-center bg-background p-4"
      >
        <Text className="mb-2 font-semibold text-destructive">Error</Text>
        <Text className="mb-4 text-center text-muted-foreground">
          {error || "Company not found"}
        </Text>
        <Button variant="outline" onPress={() => router.back()}>
          <Text className="text-foreground">Go Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center border-b border-border px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-secondary"
        >
          <ArrowLeft size={20} color={isDark ? "#ffffff" : "#000000"} />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center border-b border-border bg-card/50 px-4 py-6">
          <CustomAvatar imageUrl={company.logoUrl} fallbackText={company.name} size="lg" />
          <Text className="mt-4 text-center text-2xl font-bold text-foreground">
            {company.name}
          </Text>
          <Text className="mt-1 text-center text-base font-medium text-primary">
            {company.companyType}
          </Text>

          <View className="mt-3 flex-row items-center gap-1.5">
            <Briefcase size={16} color={isDark ? "#ffffff" : "#09090b"} />
            <Text className="font-medium text-foreground">
              {company.vacancies?.length === 1
                ? "1 active vacancy"
                : `${company.vacancies?.length || 0} active vacancies`}
            </Text>
          </View>
        </View>

        <View className="px-4 py-6">
          <Text className="mb-4 text-xl font-bold text-foreground">About {company.name}</Text>
          <View className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
            <Text className="text-base leading-relaxed text-foreground">
              {company.description || "No description provided."}
            </Text>
          </View>

          <Text className="mb-4 text-xl font-bold text-foreground">Key Information</Text>
          <View className="mb-8 rounded-xl border border-border bg-card shadow-sm">
            {company.websiteUrl && (
              <View className="flex-row items-center justify-between border-b border-border p-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Globe size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
                  </View>
                  <Text className="font-medium text-foreground">Website</Text>
                </View>
                <Pressable onPress={() => Linking.openURL(company.websiteUrl!)}>
                  <Text className="font-medium text-primary hover:underline">
                    {new URL(company.websiteUrl).hostname}
                  </Text>
                </Pressable>
              </View>
            )}

            <View className="flex-row items-center justify-between border-b border-border p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Briefcase size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
                </View>
                <Text className="font-medium text-foreground">Vacancies</Text>
              </View>
              <Text className="text-muted-foreground">
                {company.vacancies?.length || 0} active ads
              </Text>
            </View>

            <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users size={20} color={isDark ? "#ffffff" : "#4f46e5"} />
                </View>
                <Text className="font-medium text-foreground">Team size</Text>
              </View>
              <Text className="text-muted-foreground">
                {company.employees?.length || 0} members
              </Text>
            </View>
          </View>

          <Text className="mb-4 text-xl font-bold text-foreground">Open Vacancies</Text>
          {company.vacancies && company.vacancies.length > 0 ? (
            <View className="space-y-4">
              {company.vacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={
                    {
                      ...vacancy,
                      company: {
                        id: company.id,
                        name: company.name,
                        logoUrl: company.logoUrl,
                      },
                    } as any
                  }
                />
              ))}
            </View>
          ) : (
            <View className="items-center rounded-xl border border-border bg-card p-6 shadow-sm">
              <Briefcase size={32} color={isDark ? "#a1a1aa" : "#71717a"} className="mb-3" />
              <Text className="text-lg font-medium text-foreground">No active vacancies</Text>
              <Text className="mt-1 text-center text-muted-foreground">
                {"This company hasn't posted any jobs yet."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {company.websiteUrl && (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="border-t border-border bg-background px-6 pt-4"
        >
          <Button
            size="lg"
            className="w-full flex-row items-center justify-center gap-2"
            onPress={() => Linking.openURL(company.websiteUrl!)}
          >
            <Globe size={20} color={isDark ? "#09090b" : "#ffffff"} />
            <Text>Visit Website</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
