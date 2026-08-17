import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";
import packageJson from "../package.json";

describe("skeleton — current known-good behavior", () => {
  it("renders a level-1 heading with text 'SolJour'", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "SolJour" })).toBeInTheDocument();
  });

  it("renders the subtitle 'solo campaign chronicle'", () => {
    render(<Home />);
    expect(screen.getByText("solo campaign chronicle")).toBeInTheDocument();
  });

  it("renders exactly three sections, with headings Journal, Codex, Atlas in that order", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings).toHaveLength(3);
    expect(headings.map((h) => h.textContent)).toEqual(["Journal", "Codex", "Atlas"]);
  });

  it("package.json name is 'soljour' and 'next' is a dependency", () => {
    expect(packageJson.name).toBe("soljour");
    expect(packageJson.dependencies).toHaveProperty("next");
  });
});
