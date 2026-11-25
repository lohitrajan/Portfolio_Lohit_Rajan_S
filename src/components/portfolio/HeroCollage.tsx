import { usePortfolio } from "@/hooks/use-portfolio";
import type { HeroTile } from "@/content/types";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ease } from "./motion";

/**
 * Signature five-image collage. Replace any `src` with your own photo or a real project
 * screenshot — the layout keeps its proportions.
 */
const tiles = [
  {
    w: 768,
    h: 1152,
    box: "col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto lg:h-[300px] xl:h-[340px]",
    order: "order-2 lg:order-none",
    speed: 40,
    float: "[animation-delay:-1s]",
  },
  {
    w: 768,
    h: 1152,
    box: "col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto lg:h-[400px] xl:h-[450px]",
    order: "order-3 lg:order-none",
    speed: 80,
    float: "[animation-delay:-3s]",
  },
  {
    w: 1024,
    h: 1280,
    box: "col-span-2 aspect-[4/5] lg:col-span-4 lg:aspect-auto lg:h-[540px] xl:h-[620px]",
    order: "order-1 lg:order-none",
    speed: 0,
    float: "",
    center: true,
  },
  {
    w: 1536,
    h: 1024,
    box: "col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto lg:h-[420px] xl:h-[470px]",
    order: "order-4 lg:order-none",
    speed: 70,
    float: "[animation-delay:-2s]",
    position: "object-[18%_center]",
  },
  {
    w: 768,
    h: 1152,
    box: "col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto lg:h-[320px] xl:h-[360px]",
    order: "order-5 lg:order-none",
    speed: 30,
    float: "[animation-delay:-4s]",
  },
] as const;

function Tile({
  tile,
  index,
  progress,
  parallax,
}: {
  tile: (typeof tiles)[number] & HeroTile;
  index: number;
  progress: MotionValue<number>;
  parallax: boolean;
}) {
  const y = useTransform(progress, [0, 1], [0, parallax ? -tile.speed : 0]);
  const isCenter = "center" in tile && tile.center;

  return (
    <motion.div style={{ y }} className={cn("relative", tile.box, tile.order)}>
    <motion.figure
      className="size-full"
      initial={{ opacity: 0, y: 60, clipPath: "inset(100% 0 0 0 round 1.25rem)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0 round 1.25rem)" }}
      transition={{ duration: 1.1, delay: 2.2 + index * 0.1, ease }}
    >
      <div
        className={cn(
          "group relative size-full overflow-hidden rounded-[1.25rem] bg-muted shadow-soft transition-shadow duration-500 hover:shadow-lift",
          !isCenter && "lg:animate-float",
          tile.float,
        )}
        data-cursor
      >
        {tile.src ? (<img
          src={tile.src}
          alt={tile.alt}
          width={tile.w}
          height={tile.h}
          loading={isCenter ? "eager" : "lazy"}
          className={cn(
            "size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]",
            "position" in tile && tile.position,
          )}
        />) : <div className="aspect-[4/5] size-full bg-muted" aria-hidden />}
        {tile.label ? (
          <figcaption className="text-eyebrow absolute bottom-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[0.6rem] text-foreground backdrop-blur">
            {tile.label}
          </figcaption>
        ) : null}
      </div>
    </motion.figure>
    </motion.div>
  );
}

export function HeroCollage() {
  const c = usePortfolio();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  // Parallax only on wide screens — stacked mobile tiles would overlap.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      ref={ref}
      className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-12 lg:items-end lg:gap-4"
    >
      {c.heroGallery.map((image, i) => {
        const t = { ...(tiles[i % tiles.length]!), ...image };
        return (
        <Tile key={i} tile={t} index={i} progress={scrollYProgress} parallax={desktop && !reduce} />
      ); })}
    </div>
  );
}
