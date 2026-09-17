import { API_URL, fetchJson } from "@/lib/utils";

export const getLatestDraft = async (type: "COVER_LETTER" | "VACANCY" | "MATCHING", vacancyId?: string, applicationId?: string) => {
  const url = new URL(`${API_URL}/ai/draft`);
  url.searchParams.append("type", type);
  if (vacancyId) url.searchParams.append("vacancyId", vacancyId);
  if (applicationId) url.searchParams.append("applicationId", applicationId);
  return fetchJson<{ data?: { score?: number; reason?: string }; text?: string }>(url.toString());
};

export const generateCoverLetter = async (payload: { vacancyId: string; vacancyTitle: string; vacancyDescription: string; candidateAbout: string; candidateSkills: string[]; candidateExperience: string }) =>
  fetchJson<{ text: string; remainingCredits: number }>(`${API_URL}/ai/cover-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const generateVacancyDescription = async (payload: { jobTitle: string; keywords: string[] }) =>
  fetchJson<{ text: string; remainingCredits: number }>(`${API_URL}/ai/vacancy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const evaluateCandidate = async (payload: { applicationId: string; vacancyId: string; vacancyTitle: string; vacancyDescription: string; candidateAbout: string; candidateSkills: string[]; candidateExperience: string }) =>
  fetchJson<{ score: number; reason: string; remainingCredits: number }>(`${API_URL}/ai/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
