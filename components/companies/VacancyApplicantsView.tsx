import { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Vacancy } from "@/types/vacancies";
import { Application, ApplicationStatus } from "@/types/application";
import { getVacancyApplications } from "@/lib/api";
import { HrApplicationCard } from "@/components/applications/HrApplicationCard";
import { ArrowLeft, Users, Inbox } from "lucide-react-native";

interface VacancyApplicantsViewProps {
  vacancy: Vacancy;
  onBack: () => void;
}

type FilterTab = "ALL" | ApplicationStatus;

export const VacancyApplicantsView = ({
  vacancy,
  onBack,
}: VacancyApplicantsViewProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  const fetchApplications = useCallback(async () => {
    try {
      const res = await getVacancyApplications(vacancy.id);
      setApplications(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch vacancy applications", error);
      setApplications([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [vacancy.id]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchApplications();
  };

  const handleStatusUpdated = (updatedApp: Application) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app)),
    );
  };

  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      PENDING: applications.filter((a) => a.status === "PENDING").length,
      REVIEWING: applications.filter((a) => a.status === "REVIEWING").length,
      INVITED: applications.filter((a) => a.status === "INVITED").length,
      REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (activeFilter === "ALL") return applications;
    return applications.filter((a) => a.status === activeFilter);
  }, [applications, activeFilter]);

  const filterTabs: { label: string; value: FilterTab; count: number }[] = [
    { label: "All", value: "ALL", count: counts.ALL },
    { label: "Pending", value: "PENDING", count: counts.PENDING },
    { label: "Reviewed", value: "REVIEWING", count: counts.REVIEWING },
    { label: "Invited", value: "INVITED", count: counts.INVITED },
    { label: "Rejected", value: "REJECTED", count: counts.REJECTED },
  ];

  return (
    <View className="flex-1 pb-16">
      <TouchableOpacity
        onPress={onBack}
        className="mb-4 flex-row items-center gap-2 py-1"
        activeOpacity={0.7}
      >
        <ArrowLeft size={18} color="#3b82f6" />
        <Text className="font-semibold text-primary">Back to Vacancies</Text>
      </TouchableOpacity>

      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            Applicants
          </Text>
          <Text
            className="mt-0.5 text-sm font-medium text-muted-foreground"
            numberOfLines={2}
          >
            for {vacancy.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
          <Users size={14} color="#3b82f6" />
          <Text className="text-xs font-semibold text-primary">
            {applications.length} Total
          </Text>
        </View>
      </View>

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
                className={`flex-row items-center gap-1.5 rounded-full border px-3.5 py-1.5 ${isActive
                    ? "border-primary bg-primary"
                    : "border-border bg-card"
                  }`}
              >
                <Text
                  className={`text-xs font-semibold ${isActive ? "text-primary-foreground" : "text-foreground"
                    }`}
                >
                  {tab.label}
                </Text>
                <View
                  className={`rounded-full px-1.5 py-0.2 ${isActive ? "bg-primary-foreground/20" : "bg-muted"
                    }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${isActive ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                  >
                    {tab.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-3 text-xs text-muted-foreground">
            Loading applicants...
          </Text>
        </View>
      ) : applications.length === 0 ? (
        <View className="items-center justify-center rounded-3xl border border-dashed border-border bg-card p-10">
          <View className="mb-4 rounded-full bg-primary/10 p-4">
            <Inbox size={32} color="#3b82f6" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            No Applicants Yet
          </Text>
          <Text className="mt-1 text-center text-sm text-muted-foreground">
            No candidates have submitted an application for this vacancy yet.
          </Text>
        </View>
      ) : filteredApplications.length === 0 ? (
        <View className="items-center justify-center rounded-3xl border border-dashed border-border bg-card p-10">
          <Text className="text-base font-semibold text-foreground">
            No {activeFilter.toLowerCase()} applicants
          </Text>
          <Text className="mt-1 text-center text-xs text-muted-foreground">
            There are currently no candidates matching the selected status.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {filteredApplications.map((app) => (
            <HrApplicationCard
              key={app.id}
              application={app}
              onStatusUpdated={handleStatusUpdated}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
