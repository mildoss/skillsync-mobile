import { useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Application } from "@/types/application";
import { formatSalary, formatExperience, formatEnum, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplyModal } from "@/components/applications/ApplyModal";
import { ApplicationStatusBadge } from "@/components/applications/ApplicationStatusBadge";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";
import { ArrowLeft, Check } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { VacancyDetailsSkeleton } from "@/components/vacancies/VacancyDetailsSkeleton";
import { useVacancy } from "@/hooks/useVacancies";
import { useMyApplications } from "@/hooks/useApplications";

export default function VacancyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [tempApplication, setTempApplication] = useState<Application | null>(null);

  const { data: vacancy, isLoading, error } = useVacancy(id as string);
  const { data: myApps } = useMyApplications({ enabled: user?.role === "APPLICANT" && !!id });

  const myApplication = tempApplication || (myApps?.find((app) => app.vacancyId === id) ?? null);

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
        {user?.role === "EMPLOYER" ? (
          <View className="items-center py-2">
            <Text className="text-xs font-medium text-muted-foreground">
              You are viewing this vacancy as an employer.
            </Text>
          </View>
        ) : myApplication ? (
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-muted-foreground">
                Your Application Status:
              </Text>
              <ApplicationStatusBadge status={myApplication.status} />
            </View>
            <Button
              size="lg"
              variant="secondary"
              className="w-full flex-row items-center justify-center opacity-85"
              disabled
            >
              <Check size={18} color="#22c55e" className="mr-2" />
              <Text className="font-semibold text-secondary-foreground">Already Applied</Text>
            </Button>
          </View>
        ) : (
          <Button
            size="lg"
            onPress={() => {
              if (!user) {
                toast.error("Please log in", "Log in to apply for this job.");
                router.push("/(tabs)/profile");
                return;
              }
              setIsApplyModalOpen(true);
            }}
            className="w-full"
          >
            <Text className="font-semibold text-primary-foreground">Apply for Job</Text>
          </Button>
        )}
      </View>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        vacancyId={vacancy.id}
        vacancyTitle={vacancy.title}
        companyName={vacancy.company.name}
        onSuccess={(newApp) => {
          setTempApplication(
            newApp ||
              ({
                id: "temp",
                vacancyId: vacancy.id,
                status: "PENDING",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                vacancy,
              } as Application),
          );
        }}
      />
    </View>
  );
}
