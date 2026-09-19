import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Application, ApplicationStatus } from "@/types/application";
import { updateApplicationStatus, getLatestDraft, evaluateCandidate, getVacancy, getUser } from "@/lib/api";
import { toast } from "@/store/useToastStore";

interface UseHrApplicationCardProps {
  application: Application;
  onStatusUpdated?: (updatedApp: Application) => void;
}

export const useHrApplicationCard = ({
  application,
  onStatusUpdated,
}: UseHrApplicationCardProps) => {
  const [isUpdating, setIsUpdating] = useState<ApplicationStatus | null>(null);
  const [matching, setMatching] = useState<{ score: number; reason: string } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkMatch = async () => {
      try {
        const res = await getLatestDraft("MATCHING", application.id);
        if (isMounted && res?.data?.data) {
          setMatching(res.data.data);
        } else if (isMounted && (res?.data as any)?.score != null) {
          setMatching(res.data as any);
        }
      } catch (error) {
        console.error("Failed to check AI matching", error);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    void checkMatch();

    return () => {
      isMounted = false;
    };
  }, [application.id]);

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
    if (!application.applicant) return;
    setIsEvaluating(true);
    try {
      const applicant = application.applicant;
      let vacancyTitle = application.vacancy?.title || "";
      let vacancyDescription = application.vacancy?.description || "";
      let candidateAbout = applicant.about || "";
      let candidateSkills = applicant.skills?.map((s: any) => s.name) || [];
      let candidateExperience = applicant.experience != null ? `${applicant.experience} years` : "";

      if (!vacancyTitle || !vacancyDescription) {
        try {
          const vacancy = await getVacancy(application.vacancyId);
          if (vacancy) {
            vacancyTitle = vacancy.title || "";
            vacancyDescription = vacancy.description || "";
          }
        } catch {
          // ignore
        }
      }

      if (!candidateAbout || candidateSkills.length === 0) {
        try {
          const fullApplicant = await getUser(applicant.id);
          if (fullApplicant) {
            candidateAbout = fullApplicant.about || candidateAbout;
            candidateSkills = fullApplicant.skills?.map((s: any) => s.name) || candidateSkills;
            if (fullApplicant.experience != null) {
              candidateExperience = `${fullApplicant.experience} years`;
            }
          }
        } catch {
          // ignore
        }
      }

      const payload = {
        applicationId: application.id,
        vacancyId: application.vacancyId,
        vacancyTitle,
        vacancyDescription,
        candidateAbout,
        candidateSkills,
        candidateExperience,
      };
      const res = await evaluateCandidate(payload);
      if (res?.score != null) {
        setMatching({ score: res.score, reason: res.reason });
        toast.success("Analysis complete!");
      }
    } catch (error: any) {
      toast.error("Evaluation failed", error.message || "An unexpected error occurred");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleChangeStatusPrompt = () => {
    Alert.alert(
      "Change Candidate Status",
      `Choose a new status for ${application.applicant?.name} ${application.applicant?.surname}:`,
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

  return {
    isUpdating,
    matching,
    isChecking,
    isEvaluating,
    handleStatusUpdate,
    handleEvaluate,
    handleChangeStatusPrompt,
  };
};
