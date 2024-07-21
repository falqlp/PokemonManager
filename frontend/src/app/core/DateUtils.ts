export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setUTCDate(newDate.getUTCDate() + days);
  return newDate;
}

export function addMonth(date: Date, month: number): Date {
  const newDate = new Date(date);
  newDate.setUTCMonth(newDate.getUTCMonth() + month);
  return newDate;
}
