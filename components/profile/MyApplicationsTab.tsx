import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Application } from "@/types/application";
import { getMyApplications } from "@/lib/api";
import { ApplicantRequestCard } from "@/components/applications/ApplicantRequestCard";
import { Button } from "@/components/ui/button";
import { Search, Briefcase } from "lucide-react-native";

export const MyApplicationsTab = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await getMyApplications();
      setApplications(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch my applications", error);
      setApplications([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center py-16">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-3 text-xs text-muted-foreground">
          Loading your applications...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pb-10">
      <View className="mb-4">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          My Applications
        </Text>
        <Text className="text-sm text-muted-foreground">
          Track the status of jobs you've applied for.
        </Text>
      </View>

      {applications.length === 0 ? (
        <View className="items-center justify-center rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <View className="mb-4 rounded-full bg-primary/10 p-4">
            <Search size={32} color="#3b82f6" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            No applications yet
          </Text>
          <Text className="mb-6 mt-1 text-center text-sm leading-relaxed text-muted-foreground">
            You haven't applied to any jobs yet. Explore open roles to find your next career opportunity.
          </Text>
          <Button
            size="lg"
            onPress={() => router.push("/(tabs)/vacancies")}
            className="flex-row items-center gap-2"
          >
            <Briefcase size={16} color="#ffffff" />
            <Text className="font-semibold text-primary-foreground">
              Explore Vacancies
            </Text>
          </Button>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {applications.map((app) => (
            <ApplicantRequestCard key={app.id} application={app} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
