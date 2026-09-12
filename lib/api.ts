import { VacanciesResponse, Vacancy } from "@/types/vacancies";
import { Dictionaries } from "@/types/dictionaries";
import { User, UsersResponse } from "@/types/users";
import { CompaniesResponse, CompanyDetail } from "@/types/companies";
import { LoginInput, RegisterInput } from "@/lib/validation/auth";
import { AuthResponse } from "@/types/auth";
import { API_URL, fetchJson } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import * as FileSystem from "expo-file-system/legacy";

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

export const updateUser = async (data: Record<string, any>) => {
  return fetchJson<{ success: boolean; user?: User }>(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const uploadAvatar = async (
  fileUri: string,
  mimeType: string,
  fileName: string,
): Promise<{ url: string }> => {
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await FileSystem.uploadAsync(`${API_URL}/media/upload-avatar`, fileUri, {
    fieldName: "file",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    headers,
    mimeType,
  });

  if (res.status >= 200 && res.status < 300) {
    try {
      const data = JSON.parse(res.body);
      return data;
    } catch {
      return { url: "" };
    }
  } else {
    let errorMsg = `Upload failed (status ${res.status})`;
    try {
      const errData = JSON.parse(res.body);
      errorMsg = errData?.message || errData?.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
};

export const createCompany = async (data: any) =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateCompany = async (id: string, data: any) =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const getCompanyRequests = async (companyId: string) =>
  fetchJson<{ data: any[] }>(`${API_URL}/companies/${companyId}/requests`);

export const handleJoinRequest = async (
  companyId: string,
  requestId: string,
  status: "APPROVED" | "REJECTED"
) =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies/${companyId}/requests/${requestId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

export const removeEmployee = async (companyId: string, employeeId: string) =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies/${companyId}/employees/${employeeId}`, {
    method: "DELETE",
  });

export const joinCompany = async (companyId: string) => {
  try {
    return await fetchJson<{ success: boolean }>(`${API_URL}/companies/${companyId}/join`, {
      method: "POST",
    });
  } catch (error: any) {
    if (error.status === 409) return { success: true, alreadySent: true };
    throw error;
  }
};

export const getMyRequests = async () =>
  fetchJson<{ data: any[] }>(`${API_URL}/companies/requests/me`);

export const cancelJoinRequest = async (requestId: string) =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies/requests/${requestId}`, {
    method: "DELETE",
  });

export const leaveCompany = async () =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies/leave`, {
    method: "POST",
  });

export const deleteCompany = async (companyId: string) =>
  fetchJson<{ success: boolean }>(`${API_URL}/companies/${companyId}`, {
    method: "DELETE",
  });

export const uploadCompanyLogo = async (
  fileUri: string,
  mimeType: string,
  fileName: string,
): Promise<{ url: string }> => {
  const { accessToken } = useAuthStore.getState();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await FileSystem.uploadAsync(`${API_URL}/media/upload-company-logo`, fileUri, {
    fieldName: "file",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    headers,
    mimeType,
  });

  if (res.status >= 200 && res.status < 300) {
    try {
      const data = JSON.parse(res.body);
      return data;
    } catch {
      return { url: "" };
    }
  } else {
    let errorMsg = `Upload failed (status ${res.status})`;
    try {
      const errData = JSON.parse(res.body);
      errorMsg = errData?.message || errData?.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }
};
