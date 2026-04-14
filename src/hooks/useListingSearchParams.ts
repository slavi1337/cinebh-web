import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function getArrayParam(searchParams: URLSearchParams, key: string) {
  return searchParams.getAll(key);
}

export default function useListingSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsString = searchParams.toString();

  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? "0");

  const cityIds = useMemo(
    () => getArrayParam(searchParams, "cityIds"),
    [searchParamsString],
  );

  const venueIds = useMemo(
    () => getArrayParam(searchParams, "venueIds"),
    [searchParamsString],
  );

  const genreIds = useMemo(
    () => getArrayParam(searchParams, "genreIds"),
    [searchParamsString],
  );

  const projectionTimes = useMemo(
    () => getArrayParam(searchParams, "projectionTimes"),
    [searchParamsString],
  );

  function updateParams(
    updates: Record<string, string | string[] | null>,
    options?: {
      resetPage?: boolean;
      preserve?: Record<string, string>;
    },
  ) {
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
  }

  function setNextPage() {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page + 1));
    setSearchParams(next, { preventScrollReset: true });
  }

  return {
    searchParams,
    setSearchParams,
    query,
    page,
    cityIds,
    venueIds,
    genreIds,
    projectionTimes,
    updateParams,
    setNextPage,
  };
}
