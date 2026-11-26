import type { Tables } from '@/integrations/supabase/types';
import { type FieldDef, type Values, toFieldValue, validateFieldValue } from './forms';

export type DynamicDefinition = Tables<'custom_field_definitions'>;
export const dynamicTargets: Record<string, string> = { projects: 'project', education: 'education', experience: 'experience', achievements: 'achievement', certifications: 'certification', custom_section_entries: 'section' };

export function dynamicInput(d: DynamicDefinition): FieldDef {
  const common = { name: `custom_${d.id}`, label: d.label, help: d.description, placeholder: d.placeholder, required: d.required };
  const options = Array.isArray(d.options) ? d.options.map(o => typeof o === 'string' ? o : o && typeof o === 'object' && !Array.isArray(o) ? { value: String(o['value'] ?? ''), label: String(o['label'] ?? o['value'] ?? '') } : '').filter(Boolean) : [];
  switch (d.field_type) {
    case 'boolean': return { ...common, type: 'switch' };
    case 'number': return { ...common, type: 'number' };
    case 'email': return { ...common, type: 'email' };
    case 'date': return { ...common, type: 'date' };
    case 'url': case 'video': case 'reference': case 'profile_link': return { ...common, type: 'url' };
    case 'textarea': case 'richtext': return { ...common, type: 'textarea', help: d.field_type === 'richtext' ? 'Markdown: **bold**, *italic*, headings and lists. HTML is not allowed.' : d.description };
    case 'select': return { ...common, type: 'select', options: [{ value: '', label: 'Choose…' }, ...options] };
    case 'multiselect': return { ...common, type: 'multiselect', options };
    case 'repeater': return { ...common, type: 'objects', keys: [{ name: 'label', label: 'Label' }, { name: 'value', label: 'Value', type: 'textarea' }] };
    case 'date_range': return { ...common, type: 'date_range' };
    case 'icon_label': return { ...common, type: 'icon_label' };
    case 'image': case 'pdf': case 'file': return { ...common, type: 'attachment', kind: d.field_type, folder: 'custom' };
    default: return { ...common, type: 'text' };
  }
}

export function dynamicErrors(defs: DynamicDefinition[], values: Values, publishing: boolean) {
  return Object.fromEntries(defs.flatMap(d => {
    const raw = values[`custom_${d.id}`];
    const problem = validateFieldValue({ ...d, required: publishing && d.required }, raw);
    return problem ? [[`custom_${d.id}`, problem]] : [];
  }));
}

export function dynamicPayload(defs: DynamicDefinition[], values: Values) {
  return defs.map(d => ({ field_id: d.id, value: toFieldValue(d.field_type, values[`custom_${d.id}`]), status: values[`visibility_${d.id}`] === 'draft' ? 'draft' : 'published' }));
}