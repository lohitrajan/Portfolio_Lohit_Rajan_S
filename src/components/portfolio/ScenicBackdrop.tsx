import { usePortfolio } from "@/hooks/use-portfolio";

/** Full-screen scenic landscape surrounding the central canvas. */
export function ScenicBackdrop() {
  const c = usePortfolio();
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {c.scenicBackground ? (<img
        src={c.scenicBackground}
        alt=""
        width={1920}
        height={1088}
        fetchPriority="high"
        className="size-full object-cover dark:brightness-[0.35] dark:saturate-50"
      />) : <div className="aspect-[4/5] size-full bg-muted" aria-hidden />}
    </div>
  );
}
