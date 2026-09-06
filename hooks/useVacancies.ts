import { useInfiniteQuery } from "@tanstack/react-query";
import { getVacancies } from "@/lib/api";

export function useVacancies(params: Record<string, string | string[]> = {}) {
  const { data, isLoading, isFetchingNextPage, error, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["vacancies", params],
      queryFn: async ({ pageParam = 1 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("page", pageParam.toString());

        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, Array.isArray(value) ? value.join(",") : value);
          }
        });

        const response = await getVacancies(queryParams);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
      },
    });

  const vacancies = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    vacancies,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refresh: refetch,
    hasNextPage,
  };
}
