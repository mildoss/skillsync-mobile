import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CompanyType, EmploymentType, LocationType, VacancyType } from "@/types/enums";
import { Dictionaries } from "@/types/dictionaries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min: number | null, max: number | null, currency: string = "USD") {
  const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;

  if (min && max) return `${symbol}${min} - ${symbol}${max}`;
  if (min) return `From ${symbol}${min}`;
  if (max) return `Up to ${symbol}${max}`;
  return "Salary not specified";
}

export function formatExperience(exp: string | null) {
  if (!exp) return "Any experience";

  const num = parseInt(exp);
  if (!isNaN(num)) {
    if (num === 0) return "No experience";
    if (num === 1) return "1 year";
    return `${exp} years`;
  }

  return exp;
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

export function formatEnum(value: string | null | undefined): string {
  if (!value) return "";
  const text = value.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function buildQueryParams(
  params: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    } else {
      queryParams.append(key, value);
    }
  });

  return queryParams;
}

export function formatChatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const mapToOptions = (items: Dictionaries[]) =>
  items.map((item) => ({ label: item.name, value: item.id }));

const enumToOptions = <T extends Record<string, string>>(e: T) =>
  Object.values(e).map((v) => ({ label: formatEnum(v), value: v }));

export const WORK_FORMATS = enumToOptions(VacancyType);
export const COMPANY_TYPES = enumToOptions(CompanyType);
export const EMPLOYMENT_TYPES = enumToOptions(EmploymentType);
export const LOCATION_OPTIONS = Object.keys(LocationType).map((key) => ({
  label: LocationType[key as keyof typeof LocationType],
  value: key,
}));

export const EXPERIENCE_OPTIONS = [
  { label: "No experience", value: "0" },
  { label: "1 year", value: "1" },
  { label: "2 years", value: "2" },
  { label: "3 years", value: "3" },
  { label: "4 years", value: "4" },
  { label: "5+ years", value: "5" },
];

import { useAuthStore } from "@/store/useAuthStore";

export const API_URL = process.env.EXPO_PUBLIC_API_URL;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

export const fetchJson = async <T>(
  url: string,
  options: RequestInit = {},
  retries = 2,
): Promise<T> => {
  try {
    const { accessToken } = useAuthStore.getState();
    const existingHeaders = (options.headers || {}) as Record<string, string>;
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...existingHeaders,
    };

    if (accessToken && !headers["Authorization"] && !headers["authorization"]) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      const { refreshToken, logout, updateTokens } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        throw new Error("Unauthorized");
      }

      let newToken = accessToken;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Cookie: `refresh-token=${refreshToken}`,
            },
          });

          if (!refreshRes.ok) throw new Error("Refresh failed");

          const newTokens = await refreshRes.json();
          const newAccess = newTokens["access-token"];
          const newRefresh = newTokens["refresh-token"];

          await updateTokens(newAccess, newRefresh);
          isRefreshing = false;
          newToken = newAccess;
          onRefreshed(newAccess);
        } catch (e) {
          isRefreshing = false;
          refreshSubscribers = [];
          logout();
          throw new Error("Session expired. Please login again.");
        }
      } else {
        newToken = await new Promise<string>((resolve) => {
          addRefreshSubscriber(resolve);
        });
      }

      const retryHeaders: Record<string, string> = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };

      const retryRes = await fetch(url, { ...options, headers: retryHeaders });

      if (!retryRes.ok) {
        throw new Error(`HTTP ${retryRes.status} ${retryRes.statusText} for ${url}`);
      }
      return (await retryRes.json()) as T;
    }

    if (!res.ok) {
      const errorData = (await res.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;
      const errorMsg =
        errorData?.error || errorData?.message || `HTTP ${res.status} ${res.statusText}`;
      const err = new Error(errorMsg);
      (err as any).status = res.status;
      throw err;
    }

    const data: unknown = await res.json();
    return data as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = (error as any)?.status;
    const isClientError = status && status >= 400 && status < 500;

    if (
      retries > 0 &&
      !isClientError &&
      message !== "Unauthorized" &&
      !message.includes("Session expired")
    ) {
      await delay(500);
      return fetchJson<T>(url, options, retries - 1);
    }

    throw new Error(message);
  }
};
