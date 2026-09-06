export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationResponse = {
  data: Notification[];
  unreadCount: number;
};