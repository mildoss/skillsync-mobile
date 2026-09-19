import { ChatRoom, Message } from "@/types/chat";
import { API_URL, fetchJson } from "@/lib/utils";

export const getMyChats = async (): Promise<ChatRoom[]> => {
  return fetchJson<ChatRoom[]>(`${API_URL}/chats`);
};

export const getChatMessages = async (
  applicationId: string,
  cursor?: string,
): Promise<Message[]> => {
  const url = new URL(`${API_URL}/chats/${applicationId}/messages`);
  if (cursor) url.searchParams.append("cursor", cursor);
  return fetchJson<Message[]>(url.toString());
};

export const getUnreadChatsCount = async (): Promise<number> => {
  try {
    const res = await fetchJson<number>(`${API_URL}/chats/unread-count`);
    return Number(res) || 0;
  } catch {
    return 0;
  }
};
