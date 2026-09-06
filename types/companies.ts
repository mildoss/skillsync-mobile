import { PaginationMeta } from "@/types/global";
import { Vacancy } from "@/types/vacancies";

export type CompaniesResponse = {
  data: Companies[];
  meta: PaginationMeta;
};

export type CompanyType = "PRODUCT" | "OUTSOURCE" | "OUTSTAFF" | "STARTUP" | "AGENCY";

export type Companies = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  companyType: CompanyType;
  _count: {
    vacancies: number;
    employees: number;
  };
};

export type Employee = {
  id: string;
  name: string;
  surname?: string;
  position: string | null;
  avatarUrl: string | null;
};

export type CompanyDetail = Companies & {
  vacancies: Vacancy[];
  employees: Employee[];
  websiteUrl: string | null;
};

export type CompanyJoinRequest = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  companyId: string;
  userId: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    companyType: string;
  };
};

export type TeamRequest = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  companyId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    surname?: string;
    email: string;
    avatarUrl: string | null;
  };
};