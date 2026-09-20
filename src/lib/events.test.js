import { describe, expect, it } from "vitest";
import { eventIsUpcoming, formatEventDate } from "./events";

describe("event dates", () => {
  it("keeps today's event visible until the day ends in Brasilia", () => {
    expect(
      eventIsUpcoming("2026-09-19", new Date("2026-09-20T02:59:59Z")),
    ).toBe(true);
    expect(
      eventIsUpcoming("2026-09-19", new Date("2026-09-20T03:00:00Z")),
    ).toBe(false);
    expect(
      eventIsUpcoming("2026-09-21", new Date("2026-09-20T03:00:00Z")),
    ).toBe(true);
  });
  it("does not classify undated historical entries as upcoming", () => {
    expect(eventIsUpcoming(undefined)).toBe(false);
  });
  it("formats the stored date without shifting it to the previous day", () => {
    expect(formatEventDate("2026-09-19")).toBe("19 de setembro de 2026");
  });
});
