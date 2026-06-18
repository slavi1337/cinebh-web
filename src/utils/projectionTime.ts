export function isDateTimePassed(dateTime: string) {
  const parsedDateTime = new Date(dateTime);

  return !Number.isNaN(parsedDateTime.getTime())
    ? parsedDateTime <= new Date()
    : false;
}

export function isProjectionTimePassed(date: string, time: string) {
  return isDateTimePassed(`${date}T${time}`);
}
