export function getVisibleItemCount(
  page: number,
  totalElements: number,
  pageSize: number,
) {
  return Math.min((page + 1) * pageSize, totalElements);
}
