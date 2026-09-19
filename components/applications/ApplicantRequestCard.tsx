import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Application } from "@/types/application";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { formatDate } from "@/lib/utils";
import { ChevronRight, FileText, MessageSquare } from "lucide-react-native";

export const ApplicantRequestCard = ({ application }: { application: Application }) => {
  const router = useRouter();
  const vacancy = application.vacancy;

  const handlePress = () => {
    if (vacancy?.id) {
      router.push(`/vacancies/${vacancy.id}`);
    }
  };

  if (!vacancy) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-3">
          <CustomAvatar
            imageUrl={vacancy.company?.logoUrl}
            fallbackText={vacancy.company?.name || "Company"}
            size="sm"
          />
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground" numberOfLines={1}>
              {vacancy.title}
            </Text>
            <Text className="text-xs font-medium text-muted-foreground" numberOfLines={1}>
              {vacancy.company?.name || "Company"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/chats/${application.id}` as any);
            }}
            className="h-8 w-8 items-center justify-center rounded-lg bg-primary/10"
            accessibilityLabel="Open chat"
          >
            <MessageSquare size={16} color="#4f46e5" />
          </TouchableOpacity>
          <ApplicationStatusBadge status={application.status} />
        </View>
      </View>

      {/* Applied date & cover letter preview */}
      <View className="mt-3 border-t border-border/60 pt-3">
        {application.coverLetter ? (
          <View className="mb-2.5 rounded-xl bg-muted/40 p-2.5">
            <View className="mb-1 flex-row items-center gap-1.5">
              <FileText size={12} color="#6b7280" />
              <Text className="text-[11px] font-semibold text-foreground">Your Cover Letter</Text>
            </View>
            <Text className="text-xs italic text-muted-foreground" numberOfLines={2}>
              "{application.coverLetter}"
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground">
            Applied {formatDate(application.createdAt)}
          </Text>
          <View className="flex-row items-center gap-0.5">
            <Text className="text-xs font-semibold text-primary">View Vacancy</Text>
            <ChevronRight size={14} color="#3b82f6" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
