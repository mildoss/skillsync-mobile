"use server";

import { AiDraftResponse, AiGenerationType } from "@/types/ai";
import { getAuthHeaders } from "@/lib/server-utils";
import { Application } from "@/types/application";
import { Vacancy } from "@/types/vacancies";
import { User } from "@/types/users";
import { Message, ChatRoom } from "@/types/chat";

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const getMyApplications = async (): Promise<Application[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications/my`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getMyVacancies = async (): Promise<Vacancy[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/vacancies/my`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getVacancyApplications = async (vacancyId: string): Promise<Application[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications/vacancy/${vacancyId}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getLatestDraft = async (type: AiGenerationType, vacancyId?: string) => {
  const url = vacancyId
    ? `${process.env.BACKEND_URL}/ai/draft?type=${type}&vacancyId=${vacancyId}`
    : `${process.env.BACKEND_URL}/ai/draft?type=${type}`;
  try {
    const res = await fetch(url, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: null };
    }

    const data: AiDraftResponse = await res.json();

    return { data };
  } catch {
    return { data: null, error: "Failed to fetch draft" };
  }
};

export const getMyTransactions = async () => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/payments/history`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};

export const getMyChats = async (): Promise<ChatRoom[]> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/chats`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getChatMessages = async (
  applicationId: string,
  cursor?: string,
): Promise<Message[]> => {
  try {
    const url = new URL(`${process.env.BACKEND_URL}/chats/${applicationId}/messages`);
    if (cursor) url.searchParams.append("cursor", cursor);

    const res = await fetch(url.toString(), { headers: await getAuthHeaders(), cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

export const getUnreadChatsCount = async (): Promise<number> => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/chats/unread-count`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return 0;
    const count = await res.json();
    return Number(count) || 0;
  } catch {
    return 0;
  }
};