export function appendArrayParams(
  searchParams: URLSearchParams,
  key: string,
  values?: string[],
) {
  if (!values?.length) return;

  values.forEach((value) => {
    if (value) {
      searchParams.append(key, value);
    }
  });
}
