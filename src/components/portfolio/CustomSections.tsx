import { usePortfolio } from "@/hooks/use-portfolio";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./motion";
import { DynamicFields } from './DynamicFields';

export function CustomSections() {
  const c = usePortfolio();
  return <>{c.customSections.map((section, index) => (
    <section key={section.id} id={section.id} className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <SectionHeading index={String(index + 1).padStart(2, "0")} eyebrow={section.eyebrow} title={section.title} description={section.description} />
      {section.image && <img src={section.image} alt={section.title} loading="lazy" className="mt-8 max-h-96 w-full rounded-2xl object-contain" />}
      <div className={`mt-14 grid gap-6 ${section.layout === 'grid' || section.layout === 'gallery' ? 'sm:grid-cols-2 lg:grid-cols-3' : section.layout === 'timeline' ? 'border-l border-border pl-8' : ''}`}>
        {section.entries.map((entry) => <Reveal key={entry.id} className={section.layout === 'editorial' ? 'border-b border-border py-6' : 'rounded-[1.75rem] border border-border bg-card p-6 sm:p-8'}>
          {entry.title && <h3 className="text-xl font-medium tracking-tight">{entry.title}</h3>}
          <DynamicFields fields={entry.fields} />
        </Reveal>)}
      </div>
    </section>
  ))}</>;
}
