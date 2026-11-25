import ReactMarkdown from 'react-markdown';
import { FileText, ArrowUpRight, Tag } from 'lucide-react';
import type { ExtraField } from '@/content/types';

export function DynamicFields({ fields = [], location = 'card' }: { fields?: ExtraField[] | undefined; location?: 'card' | 'detail' }) {
  const visible = fields.filter(f => (!f.location || f.location === 'both' || f.location === location) && (f.value || f.items?.length || f.image || f.href));
  if (!visible.length) return null;
  return <dl className="mt-6 min-w-0 space-y-5">{visible.map(f => <div key={f.key} className="min-w-0 break-words">
    {f.style !== 'paragraph' && <dt className="text-eyebrow text-muted-foreground">{f.label}</dt>}
    <dd className="mt-2 space-y-2 text-sm text-foreground">
      {f.image ? <img src={f.image} alt={f.label} loading="lazy" className="max-h-96 w-full rounded-2xl object-contain" />
        : f.href ? <a href={f.href} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-2 underline underline-offset-4">{f.style === 'document' ? <FileText className="size-4 shrink-0" /> : <ArrowUpRight className="size-4 shrink-0" />}<span className="min-w-0 break-all">{f.value || f.label}</span></a>
        : f.style === 'badge' ? <div className="flex flex-wrap gap-2">{(f.items?.length ? f.items : [f.value]).map((v, i) => <span key={i} className="tag whitespace-normal">{f.icon && <Tag className="mr-1 size-3" />}{v}</span>)}</div>
        : f.rich ? <div className="space-y-3 [&_a]:underline [&_li]:ml-5 [&_ul]:list-disc"><ReactMarkdown skipHtml components={{ a: ({ href, children }) => /^https:\/\//.test(href ?? '') ? <a href={href} target="_blank" rel="noreferrer">{children}</a> : <span>{children}</span>, img: () => null }}>{f.value}</ReactMarkdown></div>
        : f.items?.length ? <ul className="list-disc space-y-1 pl-5">{f.items.map((v, i) => <li key={i}>{v}</li>)}</ul>
        : <p className="whitespace-pre-wrap">{f.value}</p>}
    </dd>
  </div>)}</dl>;
}