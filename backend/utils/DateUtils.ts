export function isSevenDaysApart(startDate: Date, endDate: Date): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInMs = end.getTime() - start.getTime();

  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return differenceInDays === 7;
}

export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setUTCDate(newDate.getUTCDate() + days);
  return newDate;
}
