import { addDays, isSevenDaysApart } from "../../utils/DateUtils";

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
