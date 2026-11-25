import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/** A soft trailing ring for mouse users. Hidden on touch devices and with reduced motion. */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(!!target?.closest?.("a, button, [role='button'], input, textarea, select, [data-cursor]"));
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-foreground/40"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        backgroundColor: hovering ? "color-mix(in oklab, var(--color-accent) 35%, transparent)" : "transparent",
      }}
      animate={{
        width: hovering ? 52 : 22,
        height: hovering ? 52 : 22,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
}
