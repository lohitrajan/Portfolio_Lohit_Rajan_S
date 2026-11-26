import { describe, expect, it } from "vitest";
import { cleanValues, duplicateValues, fieldKeyFrom, moveItem, NEW_ITEM_STATUS, safeAdminRedirect, slugify, toFieldValue, validateField, validateFieldValue, validateValues, type FieldDef } from "@/lib/admin/forms";

const requiredTitle: FieldDef = { name: "title", label: "Title", type: "text", required: true };

 describe("admin content rules", () => {
  it("starts every new publishable item as a draft", () => {
    expect(NEW_ITEM_STATUS).toBe("draft");
  });

  it("requires a title before content can be saved", () => {
    expect(validateValues([requiredTitle], { title: "  " })).toEqual({ title: "Title is required." });
  });

  it("only accepts secure public links", () => {
    const field: FieldDef = { name: "live_url", label: "Live URL", type: "url" };
    expect(validateField(field, "http://example.com")).toBe("Links must start with https://");
    expect(validateField(field, "https://example.com/work")).toBeNull();
  });

  it("creates safe lowercase project slugs", () => {
    expect(slugify("  SkillBridge & CampusMate! ")).toBe("skillbridge-campusmate");
    expect(validateField({ name: "slug", label: "Slug", type: "slug" }, "Bad Slug")).not.toBeNull();
  });

  it("creates stable custom field keys", () => {
    expect(fieldKeyFrom("Verified score")).toBe("verified_score");
    expect(validateField({ name: "key", label: "Key", type: "key" }, "bad-key")).not.toBeNull();
  });

  it("drops empty list items and turns optional selects into null", () => {
    expect(cleanValues([
      { name: "tags", label: "Tags", type: "list" },
      { name: "section_id", label: "Section", type: "select" },
    ], { tags: [" React ", "", "  ", "TypeScript"], section_id: "" })).toEqual({ tags: ["React", "TypeScript"], section_id: null });
  });

  it("rejects malformed JSON before it reaches the database", () => {
    const field: FieldDef = { name: "options", label: "Options", type: "json" };
    expect(validateField(field, "[broken")).toBe("Options must be valid JSON.");
    expect(cleanValues([field], { options: '["One"]' })).toEqual({ options: ["One"] });
  });

  it("preserves empty JSON options arrays when creating custom fields", () => {
    expect(cleanValues([{ name: "options", label: "Options", type: "json" }], { options: [] }))
      .toEqual({ options: [] });
  });

  it("duplicates content as a draft with a new slug", () => {
    const copy = duplicateValues({ id: "one", title: "Project", slug: "project", status: "published", sort_order: 0 }, { titleKey: "title", hasStatus: true, sortOrder: 3 });
    expect(copy["id"]).toBeUndefined();
    expect(copy["status"]).toBe("draft");
    expect(copy["sort_order"]).toBe(3);
    expect(String(copy["slug"])).toMatch(/^project-copy-/);
  });

  it("reorders only rows whose positions changed", () => {
    const rows = [{ id: "a", sort_order: 0 }, { id: "b", sort_order: 1 }, { id: "c", sort_order: 2 }];
    expect(moveItem(rows, 0, 1)).toEqual([{ id: "b", sort_order: 0 }, { id: "a", sort_order: 1 }]);
    expect(moveItem(rows, 0, -1)).toEqual([]);
  });

  it("never redirects a signed-in admin to an external site", () => {
    expect(safeAdminRedirect("https://attacker.example/steal")).toBe("/admin/dashboard");
    expect(safeAdminRedirect("/admin/projects")).toBe("/admin/projects");
    expect(safeAdminRedirect("/admin/login")).toBe("/admin/dashboard");
  });

  it("stores verified custom values without inventing empty content", () => {
    expect(toFieldValue("number", "42")).toBe(42);
    expect(toFieldValue("multiselect", ["One", ""])).toEqual(["One"]);
    expect(toFieldValue("text", "  ")).toBeNull();
    expect(validateFieldValue({ label: "Score", field_type: "number", required: true }, "wrong")).toBe("Score must be a number.");
  });
});
