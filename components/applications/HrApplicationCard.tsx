import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Application, ApplicationStatus } from "@/types/application";
import { updateApplicationStatus, getLatestDraft, evaluateCandidate } from "@/lib/api";
import { CustomAvatar } from "@/components/shared/CustomAvatar";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/store/useToastStore";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
  Check,
  RotateCcw,
  BrainCircuit,
  Sparkles,
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
  const [isUpdating, setIsUpdating] = useState<ApplicationStatus | null>(null);
  const [isCoverLetterExpanded, setIsCoverLetterExpanded] = useState(false);
  const [matching, setMatching] = useState<{ score: number; reason: string } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkMatch = async () => {
      try {
        const res = await getLatestDraft("MATCHING", application.vacancyId, application.id);
        if (isMounted && res?.data?.score != null) {
          setMatching({ score: res.data.score, reason: res.data.reason || "" });
        }
      } catch (error) {
        console.error("Failed to check AI matching", error);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };
    checkMatch();
    return () => { isMounted = false; };
  }, [application.id, application.vacancyId]);

  const applicant = application.applicant;
  if (!applicant) return null;

  const handleOpenProfile = () => {
    router.push(`/candidates/${applicant.id}`);
  };

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    setIsUpdating(newStatus);
    try {
      await updateApplicationStatus(application.id, newStatus);
      const statusLabel =
        newStatus === "INVITED"
          ? "invited to interview"
          : newStatus === "REVIEWING"
            ? "marked as reviewed"
            : newStatus.toLowerCase();
      toast.success(`Candidate ${statusLabel}`);
      if (onStatusUpdated) {
        onStatusUpdated({ ...application, status: newStatus });
      }
    } catch (error: any) {
      toast.error(
        "Failed to update status",
        error.message || "An unexpected error occurred",
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const payload = {
        applicationId: application.id,
        vacancyId: application.vacancyId,
        vacancyTitle: application.vacancy?.title || "",
        vacancyDescription: application.vacancy?.description || "",
        candidateAbout: applicant.about || "",
        candidateSkills: applicant.skills?.map((s: any) => s.name) || [],
        candidateExperience: applicant.experience != null ? `${applicant.experience} years` : "",
      };
      const res = await evaluateCandidate(payload);
      setMatching({ score: res.score, reason: res.reason });
      toast.success("Analysis complete!");
    } catch (error: any) {
      toast.error("Evaluation failed", error.message || "An unexpected error occurred");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleChangeStatusPrompt = () => {
    Alert.alert(
      "Change Candidate Status",
      `Choose a new status for ${applicant.name} ${applicant.surname}:`,
      [
        { text: "Cancel", style: "cancel" },
        ...(application.status !== "REVIEWING"
          ? [
            {
              text: "Mark as Reviewed",
              onPress: () => handleStatusUpdate("REVIEWING"),
            },
          ]
          : []),
        ...(application.status !== "INVITED"
          ? [
            {
              text: "Invite to Interview",
              onPress: () => handleStatusUpdate("INVITED"),
            },
          ]
          : []),
        ...(application.status !== "REJECTED"
          ? [
            {
              text: "Reject",
              style: "destructive" as const,
              onPress: () => handleStatusUpdate("REJECTED"),
            },
          ]
          : []),
      ],
    );
  };

  const coverLetterText = application.coverLetter?.trim();
  const isLongLetter = coverLetterText && coverLetterText.length > 130;

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

      {/* AI Matching Section */}
      <View className="mt-3 rounded-xl border border-border/70 bg-muted/20 p-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-1.5">
            <BrainCircuit size={14} color="#8b5cf6" />
            <Text className="text-xs font-semibold text-foreground">AI Matching</Text>
          </View>
          {matching && (
            <View
              className={`rounded-full px-2 py-0.5 ${
                matching.score >= 80
                  ? "bg-green-500/10"
                  : matching.score >= 50
                    ? "bg-yellow-500/10"
                    : "bg-red-500/10"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  matching.score >= 80
                    ? "text-green-600 dark:text-green-400"
                    : matching.score >= 50
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {matching.score}% MATCH
              </Text>
            </View>
          )}
        </View>
        
        {isChecking ? (
          <ActivityIndicator size="small" color="#8b5cf6" className="self-start" />
        ) : matching ? (
          <Text className="text-xs leading-relaxed text-muted-foreground">{matching.reason}</Text>
        ) : (
          <TouchableOpacity
            onPress={handleEvaluate}
            disabled={isEvaluating}
            className="flex-row items-center self-start gap-1.5 rounded-lg bg-violet-500/10 px-3 py-1.5 active:bg-violet-500/20"
          >
            {isEvaluating ? (
              <ActivityIndicator size="small" color="#8b5cf6" />
            ) : (
              <>
                <Sparkles size={14} color="#8b5cf6" />
                <Text className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                  Evaluate Candidate
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {coverLetterText ? (
        <View className="mt-3 rounded-xl border border-border/70 bg-muted/30 p-3">
          <View className="mb-1 flex-row items-center gap-1.5">
            <FileText size={13} color="#6b7280" />
            <Text className="text-xs font-semibold text-foreground">
              Cover Letter
            </Text>
          </View>
          <Text
            className="text-xs leading-relaxed text-muted-foreground"
            numberOfLines={isLongLetter && !isCoverLetterExpanded ? 3 : undefined}
          >
            {coverLetterText}
          </Text>
          {isLongLetter && (
            <TouchableOpacity
              onPress={() => setIsCoverLetterExpanded(!isCoverLetterExpanded)}
              className="mt-1 flex-row items-center gap-1 self-start py-0.5"
            >
              <Text className="text-xs font-semibold text-primary">
                {isCoverLetterExpanded ? "Show less" : "Read more"}
              </Text>
              {isCoverLetterExpanded ? (
                <ChevronUp size={12} color="#3b82f6" />
              ) : (
                <ChevronDown size={12} color="#3b82f6" />
              )}
            </TouchableOpacity>
          )}
        </View>
      ) : null}

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
