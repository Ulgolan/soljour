import { describe, expect, it } from "vitest";
import packageJson from "../package.json";

describe("skeleton — current known-good behavior", () => {
  it("package.json name is 'soljour' and 'next' is a dependency", () => {
    expect(packageJson.name).toBe("soljour");
    expect(packageJson.dependencies).toHaveProperty("next");
  });
});
