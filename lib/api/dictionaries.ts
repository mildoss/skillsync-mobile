import { Dictionaries } from "@/types/dictionaries";
import { API_URL, fetchJson } from "@/lib/utils";

export const getCategories = async () =>
  fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/categories`);

export const getSkills = async () => fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/skills`);

export const getLanguages = async () =>
  fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/languages`);

export const getDomains = async () => fetchJson<Dictionaries[]>(`${API_URL}/dictionaries/domains`);
