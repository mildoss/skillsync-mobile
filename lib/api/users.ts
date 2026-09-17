import { User, UsersResponse } from "@/types/users";
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
