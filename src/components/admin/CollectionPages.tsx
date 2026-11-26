import { useQuery } from "@tanstack/react-query";
import { listQuery } from "@/lib/admin/db";
import { codingProfileConfig, customEntryConfig, customSectionConfig, fieldDefinitionConfig, fieldValueConfig, projectConfig, projectImageConfig, projectSectionConfig, skillCategoryConfig, skillConfig } from "@/lib/admin/config";
import { CollectionEditor } from "./CollectionEditor";
import { PageHeader } from "./fields";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function SkillsPage() {
  const categories = useQuery(listQuery("skill_categories"));
  return <div className="space-y-10">
    <CollectionEditor config={skillCategoryConfig} />
    <div className="border-t border-border pt-8"><CollectionEditor config={skillConfig} heading={false} fieldOptions={{ category_id: (categories.data ?? []).map((c) => ({ value: String(c.id), label: String(c.label) })) }} /></div>
  </div>;
}

export function ProjectsPage() {
  const projects = useQuery(listQuery("projects"));
  const options = (projects.data ?? []).map((p) => ({ value: String(p.id), label: String(p.title) }));
  return <div className="space-y-10">
    <CollectionEditor config={projectConfig} />
    <div className="border-t border-border pt-8"><CollectionEditor config={projectSectionConfig} heading={false} fieldOptions={{ project_id: options }} /></div>
    <div className="border-t border-border pt-8"><CollectionEditor config={projectImageConfig} heading={false} fieldOptions={{ project_id: options }} /></div>
  </div>;
}

export function SectionsPage() {
  const sections = useQuery(listQuery("custom_sections"));
  return <div className="space-y-10">
    <CollectionEditor config={customSectionConfig} />
    <div className="border-t border-border pt-8"><CollectionEditor config={customEntryConfig} heading={false} fieldOptions={{ section_id: (sections.data ?? []).map((s) => ({ value: String(s.id), label: String(s.title) })) }} /></div>
  </div>;
}

export function FieldsPage() {
  const sections = useQuery(listQuery("custom_sections"));
  const definitions = useQuery(listQuery("custom_field_definitions"));
  return <div className="space-y-10">
    <CollectionEditor config={fieldDefinitionConfig} fieldOptions={{ section_id: (sections.data ?? []).map((s) => ({ value: String(s.id), label: String(s.title) })) }} />
    <div className="border-t border-border pt-8"><CollectionEditor config={fieldValueConfig} heading={false} fieldOptions={{ field_id: (definitions.data ?? []).map((d) => ({ value: String(d.id), label: `${String(d.label)} · ${String(d.target)}` })) }} /></div>
  </div>;
}

export function CodingProfilesPage() {
  return <CollectionEditor config={codingProfileConfig} />;
}

export function EmptyCollectionHint({ onAdd }: { onAdd: () => void }) {
  return <><PageHeader title="Nothing here" /><Button onClick={onAdd}><Plus />Add</Button></>;
}
