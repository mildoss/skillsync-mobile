import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/chat";
import { ApplicationStatus } from "@/types/application";
import { useAuthStore } from "@/store/useAuthStore";

const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "https://skillsync-backend-cdj9.onrender.com";

type UseChatSocketProps = {
  user: { id: string; name: string; avatarUrl: string | null };
  applicationId: string;
  initialMessages: Message[];
  initialStatus: ApplicationStatus;
};

export const useChatSocket = ({
  user,
  applicationId,
  initialMessages,
  initialStatus,
}: UseChatSocketProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const [chatStatus, setChatStatus] = useState<ApplicationStatus>(initialStatus);
  const socketRef = useRef<Socket | null>(null);

  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken || !applicationId) return;

    const socket = io(`${SOCKET_URL}/chats`, {
      transports: ["websocket"],
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("joinRoom", applicationId);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("receiveMessage", (newMessage: Message) => {
      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) => !(msg.id.startsWith("temp-") && msg.text === newMessage.text),
        );

        if (!prev.find((m) => m.id === newMessage.id)) {
          return [...filtered, newMessage];
        }

        return filtered;
      });
    });

    socket.on("messagesRead", (data: { readBy: string; messageIds: string[] }) => {
      if (data.readBy !== user.id) {
        setMessages((prev) =>
          prev.map((msg) => (data.messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg)),
        );
      }
    });

    socket.on(
      "applicationStatusChanged",
      (data: { applicationId: string; newStatus: ApplicationStatus }) => {
        if (data.applicationId === applicationId) {
          setChatStatus(data.newStatus);
        }
      },
    );

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom", applicationId);
        socketRef.current.disconnect();
      }
    };
  }, [applicationId, user.id, accessToken]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !text.trim()) return;

      const optimisticMsg: Message = {
        id: `temp-${Date.now()}`,
        text: text.trim(),
        applicationId,
        senderId: user.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          position: null,
        },
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      socketRef.current.emit("sendMessage", {
        applicationId,
        text: text.trim(),
      });
    },
    [applicationId, user],
  );

  const markAsRead = useCallback(
    (messageIds: string[]) => {
      if (!socketRef.current || messageIds.length === 0) return;

      socketRef.current.emit("markAsRead", { applicationId, messageIds });

      setMessages((prev) =>
        prev.map((msg) => (messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg)),
      );
    },
    [applicationId],
  );

  return {
    messages,
    setMessages,
    isConnected,
    sendMessage,
    markAsRead,
    chatStatus,
  };
};
