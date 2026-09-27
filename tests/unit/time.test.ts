import { describe, expect, it } from "vitest";
import { formatDurationMinutes, minutesBetween, minutesSinceMidnight } from "@/lib/utils/time";

describe("time utils", () => {
  it("formats durations under an hour as minutes", () => {
    expect(formatDurationMinutes(45)).toBe("45m");
  });

  it("formats exact hours without minutes", () => {
    expect(formatDurationMinutes(120)).toBe("2h");
  });

  it("formats mixed hours and minutes", () => {
    expect(formatDurationMinutes(90)).toBe("1h 30m");
  });

  it("computes minutes between two ISO timestamps", () => {
    const start = new Date();
    start.setHours(9, 0, 0, 0);
    const end = new Date();
    end.setHours(10, 15, 0, 0);
    expect(minutesBetween(start.toISOString(), end.toISOString())).toBe(75);
  });

  it("computes minutes since midnight", () => {
    const d = new Date();
    d.setHours(14, 30, 0, 0);
    expect(minutesSinceMidnight(d.toISOString())).toBe(14 * 60 + 30);
  });
});
