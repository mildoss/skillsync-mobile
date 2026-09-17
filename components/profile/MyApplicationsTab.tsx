import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Application } from "@/types/application";
import { useRouter } from "expo-router";
import { ApplicantRequestCard } from "@/components/applications/ApplicantRequestCard";
import { Button } from "@/components/ui/button";
import { Search, Briefcase } from "lucide-react-native";
import { useMyApplications } from "@/hooks/useApplications";
import { EmptyState } from "@/components/shared/EmptyState";

export const MyApplicationsTab = () => {
  const router = useRouter();
  
  const { data: applicationsRes = [], isLoading, isRefetching, refetch } = useMyApplications();
  const applications: Application[] = Array.isArray(applicationsRes) ? applicationsRes : (applicationsRes as any)?.data || [];

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
        <EmptyState
          icon={<Search size={32} color="#3b82f6" />}
          title="No applications yet"
          description="You haven't applied to any jobs yet. Explore open roles to find your next career opportunity."
          action={
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
          }
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
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
