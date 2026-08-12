import { describe, expect, it } from "vitest";
import { blankToNull } from "@/utils/stringUtils";

describe("blankToNull", () => {
  it("trims and returns non-blank values", () => {
    expect(blankToNull("  Cinebh  ")).toBe("Cinebh");
  });

  it("returns null for blank values", () => {
    expect(blankToNull("   ")).toBeNull();
  });
});
