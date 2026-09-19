import { useState, useMemo } from "react";
import { Application, ApplicationStatus } from "@/types/application";

export type FilterTab = "ALL" | ApplicationStatus;

export function useApplicationFilters(applications: Application[]) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");

  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      PENDING: applications.filter((a) => a.status === "PENDING").length,
      REVIEWING: applications.filter((a) => a.status === "REVIEWING").length,
      INVITED: applications.filter((a) => a.status === "INVITED").length,
      REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (activeFilter === "ALL") return applications;
    return applications.filter((a) => a.status === activeFilter);
  }, [applications, activeFilter]);

  const filterTabs: { label: string; value: FilterTab; count: number }[] = useMemo(
    () => [
      { label: "All", value: "ALL", count: counts.ALL },
      { label: "Pending", value: "PENDING", count: counts.PENDING },
      { label: "Reviewed", value: "REVIEWING", count: counts.REVIEWING },
      { label: "Invited", value: "INVITED", count: counts.INVITED },
      { label: "Rejected", value: "REJECTED", count: counts.REJECTED },
    ],
    [counts],
  );

  return {
    activeFilter,
    setActiveFilter,
    filteredApplications,
    filterTabs,
    counts,
  };
}
