import { NotificationResponse } from "@/types/notifications";
import { API_URL, fetchJson } from "@/lib/utils";

export const getNotifications = async () =>
  fetchJson<NotificationResponse>(`${API_URL}/notifications`);

export const markNotificationsAsRead = async () =>
  fetchJson<{ success: boolean }>(`${API_URL}/notifications/read`, {
    method: "PATCH",
  });
