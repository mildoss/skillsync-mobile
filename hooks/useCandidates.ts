import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api";

export function useCandidates(params: Record<string, string | string[]> = {}) {
  const { data, isLoading, isFetchingNextPage, error, fetchNextPage, hasNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["candidates", params],
      queryFn: async ({ pageParam = 1 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("page", pageParam.toString());

        Object.entries(params).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, Array.isArray(value) ? value.join(",") : value);
          }
        });

        const response = await getUsers(queryParams);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
      },
    });

  const candidates = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    candidates,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    refresh: refetch,
    hasNextPage,
  };
}
