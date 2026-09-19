import { Application, ApplicationStatus } from "@/types/application";
import { API_URL, fetchJson } from "@/lib/utils";

export const getMyApplications = async () => fetchJson<Application[]>(`${API_URL}/applications/my`);

export const applyToVacancy = async (vacancyId: string, coverLetter?: string) =>
  fetchJson<{ success: boolean; data?: Application }>(`${API_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vacancyId, coverLetter: coverLetter || undefined }),
  });

export const getVacancyApplications = async (vacancyId: string) =>
  fetchJson<Application[]>(`${API_URL}/applications/vacancy/${vacancyId}`);

export const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) =>
  fetchJson<{ success: boolean; data?: Application }>(
    `${API_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );

export const inviteCandidate = async (payload: {
  applicantId: string;
  vacancyId: string;
  message?: string;
}) =>
  fetchJson<{ success: boolean; data?: Application }>(`${API_URL}/applications/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicantId: payload.applicantId,
      vacancyId: payload.vacancyId,
      message: payload.message ?? "",
    }),
  });
