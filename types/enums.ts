export const VacancyType = {
  REMOTE: "REMOTE",
  OFFICE: "OFFICE",
  HYBRID: "HYBRID",
} as const;

export const CompanyType = {
  PRODUCT: "PRODUCT",
  OUTSOURCE: "OUTSOURCE",
  OUTSTAFF: "OUTSTAFF",
  STARTUP: "STARTUP",
  AGENCY: "AGENCY",
} as const;

export const EmploymentType = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  FREELANCE: "FREELANCE",
  CONTRACT: "CONTRACT",
};

export const LocationType = {
  ALL_WORLD: "All world",
  EUROPA: "Europa",
  CIS: "CIS",
  AMERICA: "America",
  ASIA: "Asia",
  AUSTRALIA: "Australia",
  OTHER: "Other",
} as const;

export type VacancyType = (typeof VacancyType)[keyof typeof VacancyType];
export type CompanyType = (typeof CompanyType)[keyof typeof CompanyType];
export type EmploymentType = (typeof EmploymentType)[keyof typeof EmploymentType];
export type LocationType = (typeof LocationType)[keyof typeof LocationType];
