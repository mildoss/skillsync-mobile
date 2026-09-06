import { User } from "./users";
import { Vacancy } from "./vacancies";

export type ApplicationStatus = "PENDING" | "REVIEWING" | "INVITED" | "REJECTED";

export type Application = {
  id: string;
  applicantId: string;
  vacancyId: string;
  coverLetter?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  applicant?: User;
  vacancy?: Vacancy;
};
