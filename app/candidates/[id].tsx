import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getUser } from "@/lib/api";
import { User } from "@/types/users";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEnum, formatExperience } from "@/lib/utils";
import { ArrowLeft, FileText } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { CandidateDetailsSkeleton } from "@/components/candidates/CandidateDetailsSkeleton";

export default function CandidateDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const [candidate, setCandidate] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const data = await getUser(id);
        setCandidate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load candidate");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCandidate();
  }, [id]);

  if (isLoading) {
    return <CandidateDetailsSkeleton />;
  }

  if (error || !candidate) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="mb-4 font-semibold text-destructive">
          {error || "Candidate not found"}
        </Text>
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
        <Pressable onPress={() => router.back()} className="-ml-2 rounded-full p-2 active:bg-muted">
          <ArrowLeft size={24} color={isDark ? "#ffffff" : "#09090b"} />
        </Pressable>
        <Text className="ml-2 text-lg font-semibold text-foreground">Candidate Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mb-6 items-center border-b border-border pb-6">
          <CustomAvatar imageUrl={candidate.avatarUrl} fallbackText={candidate.name} size="lg" />
          <Text className="mt-4 text-center text-2xl font-bold text-foreground">
            {candidate.position || "Position not specified"}
          </Text>
          <Text className="mt-1 text-center text-lg text-muted-foreground">
            {candidate.name} {candidate.surname}
          </Text>

          <View className="mt-4 flex-row flex-wrap justify-center gap-2">
            {candidate.category && <Badge variant="outline">{candidate.category.name}</Badge>}
            {candidate.location && (
              <Badge variant="outline">{formatEnum(candidate.location)}</Badge>
            )}
            <Badge variant="outline">
              {formatExperience(candidate.experience?.toString() || null)}
            </Badge>
          </View>
        </View>

        {candidate.about && (
          <View className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
            <Text className="mb-2 text-lg font-bold text-foreground">About candidate</Text>
            <Text className="text-base leading-relaxed text-foreground">{candidate.about}</Text>
          </View>
        )}

        {(candidate.skills?.length > 0 || candidate.languages?.length > 0) && (
          <View className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
            <Text className="mb-4 text-lg font-bold text-foreground">Expertise</Text>

            {candidate.skills && candidate.skills.length > 0 && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Skills
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </View>
              </View>
            )}

            {candidate.languages && candidate.languages.length > 0 && (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Languages
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {candidate.languages.map((lang) => (
                    <Badge key={lang.id} variant="secondary">
                      {lang.name}
                    </Badge>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <View className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <Text className="mb-4 text-lg font-bold text-foreground">Preferences</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Employment</Text>
              <Text className="text-right font-medium text-foreground">
                {candidate.employmentTypes?.length > 0
                  ? candidate.employmentTypes.map(formatEnum).join(", ")
                  : "Not specified"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Work format</Text>
              <Text className="text-right font-medium text-foreground">
                {candidate.workFormats?.length > 0
                  ? candidate.workFormats.map(formatEnum).join(", ")
                  : "Not specified"}
              </Text>
            </View>
          </View>
        </View>

        {candidate.cvUrl && (
          <View className="mb-6 items-center rounded-xl border border-border bg-card p-5 shadow-sm">
            <Text className="mb-4 w-full text-left text-lg font-bold text-foreground">Resume</Text>
            <Button
              variant="outline"
              className="w-full flex-row items-center justify-center gap-2"
              onPress={() => Linking.openURL(candidate.cvUrl!)}
            >
              <FileText size={20} color={isDark ? "#ffffff" : "#09090b"} />
              <Text>View Candidate CV</Text>
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Floating Invite Button - visually represented for now */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="border-t border-border bg-background px-6 pt-4"
      >
        <Button size="lg" className="w-full">
          Invite to vacancy
        </Button>
      </View>
    </View>
  );
}
