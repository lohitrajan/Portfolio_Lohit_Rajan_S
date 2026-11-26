import { describe, expect, it } from "vitest";
import { formatFieldValue, mapPortfolio, type PortfolioRows } from "@/lib/portfolio-mapper";

const empty: PortfolioRows = {
  profile: null, about: null, settings: null, skillCategories: [], skills: [], projects: [],
  projectSections: [], projectImages: [], education: [], experience: [], achievements: [],
  certifications: [], codingProfiles: [], resume: [], customSections: [], customEntries: [],
  fieldDefinitions: [], fieldValues: [],
};

describe("independent portfolio publishing", () => {
  it("does not display sample professional facts when admin details are empty", () => {
    const result = mapPortfolio(empty, () => "");
    expect(result.profile.name).toBe("");
    expect(result.projects).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.about.paragraphs).toEqual([]);
  });
  it("shows a published education entry without requiring profile, About or settings", () => {
    const result = mapPortfolio({ ...empty, education: [{
      id: "education-test", institution: "Test institution", degree: "", department: "",
      academic_year: "", start_year: "", end_year: "", cgpa: "", coursework: [], achievements: [],
      certifications: [], is_current: false, description: "", status: "published", sort_order: 0,
      created_at: "2026-11-20", updated_at: "2026-11-20",
    }] }, () => "");
    expect(result.education[0]?.institution).toBe("Test institution");
  });
  it("formats saved repeaters without displaying empty rows", () => {
    expect(formatFieldValue({ key: "items", label: "Items", field_type: "repeater" },
      [{ label: "Language", value: "TypeScript" }, { label: "", value: "" }], () => "")?.items)
      .toEqual(["Language: TypeScript"]);
  });
  it("only displays an attachment when a readable URL was resolved", () => {
    const definition = { key: "certificate", label: "Certificate", field_type: "pdf" };
    expect(formatFieldValue(definition, { path: "custom/test.pdf", name: "test.pdf" }, () => "")).toBeNull();
    expect(formatFieldValue(definition, { path: "custom/test.pdf", name: "test.pdf" }, () => "https://example.com/test.pdf")?.href)
      .toBe("https://example.com/test.pdf");
  });
});