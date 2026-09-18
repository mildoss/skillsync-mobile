import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Application } from "@/types/application";
import { useHrApplicationCard } from "@/hooks/useHrApplicationCard";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ApplicationEvaluator } from "./ApplicationEvaluator";
import { ApplicationCoverLetter } from "./ApplicationCoverLetter";
import { Button } from "@/components/ui/button";
import {
  X,
  Eye,
  Check,
  RotateCcw,
} from "lucide-react-native";
import { formatEnum, formatExperience } from "@/lib/utils";

interface HrApplicationCardProps {
  application: Application;
  onStatusUpdated?: (updatedApp: Application) => void;
}

export const HrApplicationCard = ({
  application,
  onStatusUpdated,
}: HrApplicationCardProps) => {
  const router = useRouter();
  const {
    isUpdating,
    matching,
    isChecking,
    isEvaluating,
    handleStatusUpdate,
    handleEvaluate,
    handleChangeStatusPrompt,
  } = useHrApplicationCard({ application, onStatusUpdated });

  const applicant = application.applicant;
  if (!applicant) return null;

  const handleOpenProfile = () => {
    router.push(`/candidates/${applicant.id}`);
  };

  return (
    <View className="mb-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-3">
        <TouchableOpacity
          onPress={handleOpenProfile}
          activeOpacity={0.7}
          className="flex-1 flex-row items-center gap-3"
        >
          <CustomAvatar
            imageUrl={applicant.avatarUrl}
            fallbackText={applicant.name}
            size="sm"
          />
          <View className="flex-1">
            <Text
              className="text-base font-bold text-foreground"
              numberOfLines={1}
            >
              {applicant.name} {applicant.surname}
            </Text>
            <Text
              className="text-xs font-medium text-muted-foreground"
              numberOfLines={1}
            >
              {applicant.position || "Candidate"}
            </Text>
          </View>
        </TouchableOpacity>

        <ApplicationStatusBadge status={application.status} />
      </View>

      {(applicant.experience != null || applicant.location) && (
        <View className="mt-3 flex-row flex-wrap items-center gap-2">
          {applicant.experience != null && (
            <View className="rounded-md bg-muted px-2 py-0.5">
              <Text className="text-xs text-muted-foreground">
                {formatExperience(String(applicant.experience))}
              </Text>
            </View>
          )}
          {applicant.location && (
            <View className="rounded-md bg-muted px-2 py-0.5">
              <Text className="text-xs text-muted-foreground">
                {formatEnum(applicant.location)}
              </Text>
            </View>
          )}
        </View>
      )}

      {applicant.skills && applicant.skills.length > 0 && (
        <View className="mt-2.5 flex-row flex-wrap gap-1.5">
          {applicant.skills.slice(0, 5).map((skill: any) => (
            <View
              key={skill.id || skill.name}
              className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5"
            >
              <Text className="text-[11px] font-medium text-foreground">
                {skill.name}
              </Text>
            </View>
          ))}
          {applicant.skills.length > 5 && (
            <View className="rounded-full bg-muted/60 px-2 py-0.5">
              <Text className="text-[11px] font-medium text-muted-foreground">
                +{applicant.skills.length - 5}
              </Text>
            </View>
          )}
        </View>
      )}

      <ApplicationEvaluator
        matching={matching}
        isChecking={isChecking}
        isEvaluating={isEvaluating}
        onEvaluate={handleEvaluate}
      />

      <ApplicationCoverLetter coverLetterText={application.coverLetter} />

      <View className="mt-4 border-t border-border/60 pt-3">
        {application.status === "PENDING" && (
          <View className="flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-destructive/30 active:bg-destructive/10"
              disabled={isUpdating !== null}
              onPress={() => handleStatusUpdate("REJECTED")}
            >
              {isUpdating === "REJECTED" ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <>
                  <X size={14} color="#ef4444" className="mr-1" />
                  <Text className="text-xs font-semibold text-destructive">
                    Reject
                  </Text>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/30 active:bg-primary/10"
              disabled={isUpdating !== null}
              onPress={() => handleStatusUpdate("REVIEWING")}
            >
              {isUpdating === "REVIEWING" ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <>
                  <Eye size={14} color="#3b82f6" className="mr-1" />
                  <Text className="text-xs font-semibold text-primary">
                    Review
                  </Text>
                </>
              )}
            </Button>

            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center rounded-xl bg-green-600 px-3 py-2.5 active:bg-green-700"
              disabled={isUpdating !== null}
              onPress={() => handleStatusUpdate("INVITED")}
            >
              {isUpdating === "INVITED" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Check size={14} color="#ffffff" className="mr-1" />
                  <Text className="text-xs font-semibold text-white">
                    Invite
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {application.status === "REVIEWING" && (
          <View className="flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-destructive/30 active:bg-destructive/10"
              disabled={isUpdating !== null}
              onPress={() => handleStatusUpdate("REJECTED")}
            >
              {isUpdating === "REJECTED" ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <>
                  <X size={14} color="#ef4444" className="mr-1" />
                  <Text className="text-xs font-semibold text-destructive">
                    Reject
                  </Text>
                </>
              )}
            </Button>

            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center rounded-xl bg-green-600 px-3 py-2.5 active:bg-green-700"
              disabled={isUpdating !== null}
              onPress={() => handleStatusUpdate("INVITED")}
            >
              {isUpdating === "INVITED" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Check size={14} color="#ffffff" className="mr-1" />
                  <Text className="text-xs font-semibold text-white">
                    Invite to Interview
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {(application.status === "INVITED" || application.status === "REJECTED") && (
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-muted-foreground">
              {application.status === "INVITED"
                ? "Candidate was invited to interview."
                : "Application was rejected."}
            </Text>
            <TouchableOpacity
              onPress={handleChangeStatusPrompt}
              disabled={isUpdating !== null}
              className="flex-row items-center gap-1 rounded-lg border border-border px-2.5 py-1 active:bg-muted"
            >
              {isUpdating !== null ? (
                <ActivityIndicator size="small" color="#6b7280" />
              ) : (
                <>
                  <RotateCcw size={12} color="#6b7280" />
                  <Text className="text-xs font-medium text-foreground">
                    Change
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
