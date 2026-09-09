import { VacanciesResponse, Vacancy } from "@/types/vacancies";
import { Dictionaries } from "@/types/dictionaries";
import { User, UsersResponse } from "@/types/users";
import { CompaniesResponse, CompanyDetail } from "@/types/companies";
import { LoginInput, RegisterInput } from "@/lib/validation/auth";
import { AuthResponse } from "@/types/auth";
import { API_URL, fetchJson } from "@/lib/utils";

export const getUsers = async (queryParams: URLSearchParams) =>
  fetchJson<UsersResponse>(`${API_URL}/users?${queryParams}`);

export const getUser = async (id: string) => fetchJson<User>(`${API_URL}/users/${id}`);

export const getMe = async (explicitToken?: string): Promise<User | null> => {
  try {
    const options: RequestInit = explicitToken
      ? { headers: { Authorization: `Bearer ${explicitToken}` } }
      : {};
    return await fetchJson<User>(`${API_URL}/users/me`, options);
  } catch {
    return null;
  }
};

export const getVacancies = async (queryParams: URLSearchParams) =>
  fetchJson<VacanciesResponse>(`${API_URL}/vacancies?${queryParams}`);

export const getVacancy = async (id: string) => fetchJson<Vacancy>(`${API_URL}/vacancies/${id}`);

export const getCompanies = async (queryParams: URLSearchParams) =>
  fetchJson<CompaniesResponse>(`${API_URL}/companies?${queryParams}`);

export const getCompany = async (idOrSlug: string) =>
  fetchJson<CompanyDetail>(`${API_URL}/companies/${idOrSlug}`);

export const getCategories = async () =>
  fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/categories`);
export const getSkills = async () => fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/skills`);
export const getLanguages = async () =>
  fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/languages`);
export const getDomains = async () => fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/domains`);

export const loginApi = async (data: LoginInput) =>
  fetchJson<AuthResponse>(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const registerApi = async (data: RegisterInput) =>
  fetchJson<AuthResponse>(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
