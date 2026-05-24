export type FilterOption = {
  id: string;
  label: string;
  cityId?: string | null;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
