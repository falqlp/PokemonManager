import { addDays, isSevenDaysApart, addYears, calculateAge } from "./DateUtils";

describe("isSevenDaysApart function", () => {
  it("returns true if two dates are seven days apart", () => {
    const date1 = new Date("2024-05-25");
    const date2 = new Date("2024-06-01");
    expect(isSevenDaysApart(date1, date2)).toBe(true);
  });

  it("returns false if two dates are not seven days apart", () => {
    const date1 = new Date("2024-05-25");
    const date2 = new Date("2024-05-26");
    expect(isSevenDaysApart(date1, date2)).toBe(false);
  });

  it("consider time, returns false if two dates difference is not exactly seven days", () => {
    const date1 = new Date("2024-05-25T00:00:00");
    const date2 = new Date("2024-06-01T01:00:00"); // 7 days and 1 hour apart
    expect(isSevenDaysApart(date1, date2)).toBe(false);
  });
});

describe("addDays function", () => {
  it("adds the correct number of days to the date", () => {
    const date = new Date("2024-05-25");
    const numberOfDaysToAdd = 7;
    const expectedResult = new Date("2024-06-01");
    expect(addDays(date, numberOfDaysToAdd)).toEqual(expectedResult);
  });

  it("returns the same date when zero days are added", () => {
    const date = new Date("2024-05-25");
    expect(addDays(date, 0)).toEqual(date);
  });
});

describe("addYear function", () => {
  it("adds the correct number of years to the date", () => {
    const date = new Date("2024-05-25");
    const numberOfYearsToAdd = 1;
    const expectedResult = new Date("2025-05-25");
    expect(addYears(date, numberOfYearsToAdd)).toEqual(expectedResult);
  });

  it("returns the same date when zero years are added", () => {
    const date = new Date("2024-05-25");
    expect(addYears(date, 0)).toEqual(date);
  });
});

describe("calculateAge function", () => {
  it("calculates the correct age for a birthdate", () => {
    const birthdate = new Date("2000-05-25");
    const today = new Date("2024-05-25");
    expect(calculateAge(birthdate, today)).toEqual(24);
  });

  it("calculates the correct age if today is before the birthdate in the current year", () => {
    const birthdate = new Date("2000-06-01");
    const today = new Date("2024-05-25");
    expect(calculateAge(birthdate, today)).toEqual(23);
  });

  it("returns 0 if the birthdate is today", () => {
    const birthdate = new Date("2024-05-25");
    const today = new Date("2024-05-25");
    expect(calculateAge(birthdate, today)).toEqual(0);
  });
});
