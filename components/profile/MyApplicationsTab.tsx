import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Application } from "@/types/application";
import { useRouter } from "expo-router";
import { ApplicantRequestCard } from "@/components/applications/ApplicantRequestCard";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Inbox } from "lucide-react-native";
import { useMyApplications } from "@/hooks/useApplications";
import { useApplicationFilters } from "@/hooks/useApplicationFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

export const MyApplicationsTab = () => {
  const router = useRouter();

  const {
    data: applicationsRes = [],
    isLoading,
    isRefetching,
    refetch,
  } = useMyApplications();
  const applications: Application[] = Array.isArray(applicationsRes)
    ? applicationsRes
    : (applicationsRes as any)?.data || [];

  const { activeFilter, setActiveFilter, filteredApplications, filterTabs } =
    useApplicationFilters(applications);

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
        <View className="flex-1">
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.value;
                return (
                  <TouchableOpacity
                    key={tab.value}
                    onPress={() => setActiveFilter(tab.value)}
                    className={cn(
                      "flex-row items-center gap-1.5 rounded-full border px-3.5 py-1.5",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-border bg-card",
                    )}
                  >
                    <Text
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-primary-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {tab.label}
                    </Text>
                    <View
                      className={cn(
                        "min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5",
                        isActive ? "bg-primary-foreground/20" : "bg-muted",
                      )}
                    >
                      <Text
                        className={cn(
                          "text-[10px] font-bold",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {filteredApplications.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Inbox size={32} color="#9ca3af" className="mb-2 opacity-40" />
              <Text className="text-sm font-semibold text-foreground">
                No {activeFilter.toLowerCase()} applications
              </Text>
              <Text className="mt-1 text-center text-xs text-muted-foreground">
                You have no applications with this status.
              </Text>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
            >
              {filteredApplications.map((app) => (
                <ApplicantRequestCard key={app.id} application={app} />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};
