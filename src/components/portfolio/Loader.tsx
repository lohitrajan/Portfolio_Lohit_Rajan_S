import { usePortfolio } from "@/hooks/use-portfolio";
import { Monogram } from "./Monogram";

/** Brief branded intro. Animates and removes itself purely with CSS. */
export function Loader() {
  const c = usePortfolio();
  const { profile } = c;
  return (
    <div
      aria-hidden
      className="intro-loader pointer-events-none fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <Monogram animated className="size-20 text-foreground" />
      <p className="text-eyebrow mt-6 text-muted-foreground">{profile.name}</p>
      <div className="mt-4 h-px w-40 overflow-hidden bg-border">
        <div className="intro-loader-bar h-full w-full bg-foreground" />
      </div>
    </div>
  );
}
