import { API_URL, fetchJson, buildQueryParams } from "@/lib/utils";
import { AiDraftResponse, AiGenerationType } from "@/types/ai";

export const getLatestDraft = async (type: AiGenerationType, vacancyId?: string) => {
  const query = buildQueryParams({ type, vacancyId });
  try {
    const res = await fetchJson<AiDraftResponse>(`${API_URL}/ai/draft?${query.toString()}`);
    return { data: res };
  } catch {
    return { data: null };
  }
};

export const generateCoverLetter = async (payload: {
  vacancyId: string;
  vacancyTitle: string;
  vacancyDescription: string;
  candidateAbout: string;
  candidateSkills: string[];
  candidateExperience: string;
}) =>
  fetchJson<{ text: string; remainingCredits: number }>(`${API_URL}/ai/cover-letter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const generateVacancyDescription = async (payload: {
  jobTitle: string;
  keywords: string[];
}) =>
  fetchJson<{ text: string; remainingCredits: number }>(`${API_URL}/ai/vacancy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const evaluateCandidate = async (payload: {
  applicationId: string;
  vacancyId: string;
  vacancyTitle: string;
  vacancyDescription: string;
  candidateAbout: string;
  candidateSkills: string[];
  candidateExperience: string;
}) =>
  fetchJson<{ score: number; reason: string; remainingCredits: number }>(`${API_URL}/ai/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
