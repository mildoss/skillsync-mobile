import { VacanciesResponse, Vacancy } from "@/types/vacancies";
import { Dictionaries } from "@/types/dictionaries";
import { User, UsersResponse } from "@/types/users";
import { CompaniesResponse, CompanyDetail } from "@/types/companies";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchJson = async <T>(url: string, retries = 2): Promise<T> => {
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    }

    const data: unknown = await res.json();

    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (retries > 0) {
      console.warn(`⚠️ Request failed: ${message}. Retrying in 500ms...`);
      await delay(500);
      return fetchJson<T>(url, retries - 1);
    }

    console.error(`❌ Final fetch error for ${url}:`, message);
    throw new Error(`Failed after retries: ${message}`);
  }
};

export const getUsers = async (queryParams: URLSearchParams) =>
  fetchJson<UsersResponse>(`${process.env.BACKEND_URL}/users?${queryParams}`);

export const getUser = async (id: string) =>
  fetchJson<User>(`${process.env.BACKEND_URL}/users/${id}`);

export const getVacancies = async (queryParams: URLSearchParams) =>
  fetchJson<VacanciesResponse>(`${process.env.BACKEND_URL}/vacancies?${queryParams}`);

export const getVacancy = async (id: string) =>
  fetchJson<Vacancy>(`${process.env.BACKEND_URL}/vacancies/${id}`);

export const getCompanies = async (queryParams: URLSearchParams) =>
  fetchJson<CompaniesResponse>(`${process.env.BACKEND_URL}/companies?${queryParams}`);

export const getCompany = async (idOrSlug: string) =>
  fetchJson<CompanyDetail>(`${process.env.BACKEND_URL}/companies/${idOrSlug}`);

export const getCategories = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/categories`);
export const getSkills = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/skills`);
export const getLanguages = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/languages`);
export const getDomains = async () =>
  fetchJson<Dictionaries[]>(`${process.env.BACKEND_URL}/dictionaries/domains`);

