import { LoginInput, RegisterInput } from "@/lib/validation/auth";
import { AuthResponse } from "@/types/auth";
import { API_URL, fetchJson } from "@/lib/utils";

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
