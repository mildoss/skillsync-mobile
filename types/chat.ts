import { User } from "./users";
import { ApplicationStatus } from "@/types/application";

export type Message = {
  id: string;
  text: string;
  senderId: string;
  applicationId: string;
  isRead: boolean;
  isSystem?: boolean;
  createdAt: string;
  sender: Pick<User, "id" | "name" | "surname" | "avatarUrl" | "position">;
}

export type ChatRoom = {
  id: string;
  applicantId: string;
  vacancyId: string;
  status: ApplicationStatus;
  updatedAt: string;
  vacancy: {
    title: string;
    company: {
      id: string;
      name: string;
      logoUrl: string | null;
    };
  };
  applicant: {
    id: string;
    name: string;
    surname: string;
    avatarUrl: string | null;
  };
  messages: Message[];
  _count: {
    messages: number;
  };
}
