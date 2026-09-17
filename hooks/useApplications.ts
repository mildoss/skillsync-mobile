import { useQuery } from "@tanstack/react-query";
import { getMyApplications, getVacancyApplications } from "@/lib/api";

export function useMyApplications(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
    enabled: options?.enabled,
  });
}

export function useVacancyApplications(vacancyId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["vacancyApplications", vacancyId],
    queryFn: () => getVacancyApplications(vacancyId),
    enabled: !!vacancyId && (options?.enabled ?? true),
  });
}
