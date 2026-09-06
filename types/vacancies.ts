import { PaginationMeta } from "@/types/global";

export type VacanciesResponse = {
  data: Vacancy[];
  meta: PaginationMeta;
};

export type Vacancy = {
  id: string;
  title: string;
  description: string;
  domain: string | null;
  experience: string | null;
  isActive: boolean;
  type: string;
  location: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  company: {
    id: string;
    name: string;
    logoUrl: string | null;
    companyType: string;
  };
  currency: string;
  salaryMin: number | null;
  salaryMax: number | null;
  skills: {
    id: string;
    name: string;
    slug: string;
  }[];
  languages: {
    id: string;
    name: string;
    slug: string;
  }[];
  createdAt: string;
  updatedAt: string;
};
