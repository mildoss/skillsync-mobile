import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable, Linking } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
      <View className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-destructive font-semibold mb-4">{error || "Candidate not found"}</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View
        style={{ paddingTop: Math.max(insets.top, 16) }}
        className="px-4 pb-3 border-b border-border flex-row items-center"
      >
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-muted">
          <ArrowLeft size={24} color={isDark ? "#ffffff" : "#09090b"} />
        </Pressable>
        <Text className="text-lg font-semibold text-foreground ml-2">Candidate Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center mb-6 border-b border-border pb-6">
          <CustomAvatar
            imageUrl={candidate.avatarUrl}
            fallbackText={candidate.name}
            size="lg"
          />
          <Text className="text-2xl font-bold text-foreground mt-4 text-center">
            {candidate.position || "Position not specified"}
          </Text>
          <Text className="text-muted-foreground text-lg mt-1 text-center">
            {candidate.name} {candidate.surname}
          </Text>
          
          <View className="flex-row flex-wrap justify-center gap-2 mt-4">
            {candidate.category && <Badge variant="outline">{candidate.category.name}</Badge>}
            {candidate.location && <Badge variant="outline">{formatEnum(candidate.location)}</Badge>}
            <Badge variant="outline">{formatExperience(candidate.experience?.toString() || null)}</Badge>
          </View>
        </View>

        {candidate.about && (
          <View className="mb-6 bg-card rounded-xl border border-border p-5 shadow-sm">
            <Text className="text-lg font-bold text-foreground mb-2">About candidate</Text>
            <Text className="text-foreground text-base leading-relaxed">
              {candidate.about}
            </Text>
          </View>
        )}

        {(candidate.skills?.length > 0 || candidate.languages?.length > 0) && (
          <View className="mb-6 bg-card rounded-xl border border-border p-5 shadow-sm">
            <Text className="text-lg font-bold text-foreground mb-4">Expertise</Text>
            
            {candidate.skills && candidate.skills.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Skills</Text>
                <View className="flex-row flex-wrap gap-2">
                  {candidate.skills.map(skill => (
                    <Badge key={skill.id} variant="secondary">{skill.name}</Badge>
                  ))}
                </View>
              </View>
            )}

            {candidate.languages && candidate.languages.length > 0 && (
              <View>
                <Text className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Languages</Text>
                <View className="flex-row flex-wrap gap-2">
                  {candidate.languages.map(lang => (
                    <Badge key={lang.id} variant="secondary">{lang.name}</Badge>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        <View className="mb-6 bg-card rounded-xl border border-border p-5 shadow-sm">
          <Text className="text-lg font-bold text-foreground mb-4">Preferences</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Employment</Text>
              <Text className="text-foreground font-medium text-right">
                {candidate.employmentTypes?.length > 0
                  ? candidate.employmentTypes.map(formatEnum).join(", ")
                  : "Not specified"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Work format</Text>
              <Text className="text-foreground font-medium text-right">
                {candidate.workFormats?.length > 0
                  ? candidate.workFormats.map(formatEnum).join(", ")
                  : "Not specified"}
              </Text>
            </View>
          </View>
        </View>

        {candidate.cvUrl && (
          <View className="mb-6 bg-card rounded-xl border border-border p-5 shadow-sm items-center">
            <Text className="text-lg font-bold text-foreground mb-4 w-full text-left">Resume</Text>
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
        className="px-6 pt-4 bg-background border-t border-border"
      >
        <Button size="lg" className="w-full">
          Invite to vacancy
        </Button>
      </View>
    </View>
  );
}
