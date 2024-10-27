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

export function addYears(date: Date, years: number): Date {
  const newDate = new Date(date);
  newDate.setUTCFullYear(newDate.getUTCFullYear() + years);
  return newDate;
}

export function calculateAge(birthdate: Date, today: Date): number {
  birthdate = new Date(birthdate);
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthdate.getDate())
  ) {
    age -= 1;
  }
  return age;
}
