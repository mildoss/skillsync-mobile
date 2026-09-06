import { useState, useEffect, useCallback } from "react";
import { getVacancies } from "@/lib/api";
import { Vacancy } from "@/types/vacancies";

export function useVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVacancies = useCallback(
    async (pageNumber: number, isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        } else {
          setIsFetchingNextPage(true);
        }
        setError(null);

        const queryParams = new URLSearchParams();
        queryParams.append("page", pageNumber.toString());

        const response = await getVacancies(queryParams);

        if (isInitial) {
          setVacancies(response.data);
        } else {
          setVacancies((prev) => [...prev, ...response.data]);
        }
        setTotalPages(response.meta.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch vacancies"));
      } finally {
        setIsLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchVacancies(1, true);
  }, [fetchVacancies]);

  const fetchNextPage = () => {
    if (!isFetchingNextPage && !isLoading && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVacancies(nextPage, false);
    }
  };

  const refresh = () => {
    setPage(1);
    fetchVacancies(1, true);
  };

  return {
    vacancies,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refresh,
    hasNextPage: page < totalPages,
  };
}
