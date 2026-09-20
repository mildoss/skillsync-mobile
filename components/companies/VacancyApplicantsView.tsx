import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Vacancy } from "@/types/vacancies";
import { HrApplicationCard } from "@/components/applications/HrApplicationCard";
import { ArrowLeft, Users, Inbox } from "lucide-react-native";
import { useVacancyApplications } from "@/hooks/useApplications";
import { useApplicationFilters } from "@/hooks/useApplicationFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

interface VacancyApplicantsViewProps {
  vacancy: Vacancy;
  onBack: () => void;
}

export const VacancyApplicantsView = ({ vacancy, onBack }: VacancyApplicantsViewProps) => {
  const {
    data: applications = [],
    isLoading,
    isRefetching,
    refetch,
  } = useVacancyApplications(vacancy.id);

  const { activeFilter, setActiveFilter, filteredApplications, filterTabs } =
    useApplicationFilters(applications);

  const handleStatusUpdated = () => {
    refetch();
  };

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
          <Text className="text-2xl font-bold tracking-tight text-foreground" numberOfLines={2}>
            Applicants
          </Text>
          <Text className="mt-0.5 text-sm font-medium text-muted-foreground" numberOfLines={2}>
            for {vacancy.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
          <Users size={14} color="#3b82f6" />
          <Text className="text-xs font-semibold text-primary">{applications.length} Total</Text>
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
                className={cn(
                  "flex-row items-center gap-1.5 rounded-full border px-3.5 py-1.5",
                  isActive ? "border-primary bg-primary" : "border-border bg-card",
                )}
              >
                <Text
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-primary-foreground" : "text-muted-foreground",
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
                      isActive ? "text-primary-foreground" : "text-muted-foreground",
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

      {isLoading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-3 text-xs text-muted-foreground">Loading applicants...</Text>
        </View>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Inbox size={32} color="#3b82f6" />}
          title="No applicants yet"
          description="You haven't received any applications for this vacancy yet. Check back later."
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={<Inbox size={32} color="#a1a1aa" />}
          title={`No ${activeFilter.toLowerCase()} applications`}
          description={`There are currently no applications with the status "${activeFilter.toLowerCase()}"`}
          variant="minimal"
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
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
