import { PaginationMeta } from "@/types/global";
import { EmploymentType, VacancyType } from "@/types/enums";
import { Dictionaries } from "@/types/dictionaries";

export type UsersResponse = {
  data: User[];
  meta: PaginationMeta;
};

export type User = {
  id: string;
  name: string;
  surname?: string;
  email: string;
  role: "APPLICANT" | "EMPLOYER";
  companyId: string | null;
  companyRole: "OWNER" | "RECRUITER" | null;
  about: string | null;
  avatarUrl: string | null;
  position: string | null;
  experience: number | null;
  workFormats: VacancyType[];
  employmentTypes: EmploymentType[];
  location: string | null;
  cvUrl?: string | null;
  categoryId: string | null;
  pendingCompanyIds?: string[];
  category: Dictionaries | null;
  aiCredits: number;
  company: {
    name: string;
    logoUrl: string | null;
    companyType: string;
  } | null;
  skills: Dictionaries[];
  languages: Dictionaries[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};