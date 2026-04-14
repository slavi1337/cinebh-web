import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export default function useListingSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsString = searchParams.toString();

  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? "0");

  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParamsString],
  );

  const getArrayParam = useCallback(
    (key: string) => searchParams.getAll(key),
    [searchParamsString],
  );

  const updateParams = useCallback(
    (
      updates: Record<string, string | string[] | null>,
      options?: {
        resetPage?: boolean;
        preserve?: Record<string, string>;
      },
    ) => {
      const next = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        next.delete(key);

        if (value === null) {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item) {
              next.append(key, item);
            }
          });
          return;
        }

        if (value) {
          next.set(key, value);
        }
      });

      if (options?.resetPage !== false) {
        next.set("page", "0");
      }

      if (options?.preserve) {
        Object.entries(options.preserve).forEach(([key, value]) => {
          if (!next.get(key)) {
            next.set(key, value);
          }
        });
      }

      setSearchParams(next, { preventScrollReset: true });
    },
    [searchParams, setSearchParams],
  );

  const setNextPage = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page + 1));
    setSearchParams(next, { preventScrollReset: true });
  }, [page, searchParams, setSearchParams]);

  return useMemo(
    () => ({
      searchParams,
      setSearchParams,
      query,
      page,
      getParam,
      getArrayParam,
      updateParams,
      setNextPage,
    }),
    [
      searchParams,
      setSearchParams,
      query,
      page,
      getParam,
      getArrayParam,
      updateParams,
      setNextPage,
    ],
  );
}
