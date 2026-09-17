import { VacanciesResponse, Vacancy } from "@/types/vacancies";
import { API_URL, fetchJson } from "@/lib/utils";

export const getVacancies = async (queryParams: URLSearchParams) =>
  fetchJson<VacanciesResponse>(`${API_URL}/vacancies?${queryParams}`);

export const getVacancy = async (id: string) => fetchJson<Vacancy>(`${API_URL}/vacancies/${id}`);

export const getMyVacancies = async () =>
  fetchJson<Vacancy[]>(`${API_URL}/vacancies/my`);

export const createVacancy = async (data: any) =>
  fetchJson<{ success: boolean; data?: Vacancy }>(`${API_URL}/vacancies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateVacancy = async (vacancyId: string, data: any) =>
  fetchJson<{ success: boolean; data?: Vacancy }>(`${API_URL}/vacancies/${vacancyId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteVacancy = async (vacancyId: string) =>
  fetchJson<{ success: boolean }>(`${API_URL}/vacancies/${vacancyId}`, {
    method: "DELETE",
  });
