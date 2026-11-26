import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode, MouseEvent } from "react";

/**
 * Link to a section of the home page. Smooth-scrolls when already on "/",
 * otherwise navigates home and jumps to the section.
 */
export function SectionLink({
  id,
  children,
  className,
  onNavigate,
  ...rest
}: {
  id: string;
  children: ReactNode;
  className?: string | undefined;
  onNavigate?: (() => void) | undefined;
  "aria-current"?: "page" | undefined;
  "aria-label"?: string;
}) {
  const pathname = useLocation({ select: (l) => l.pathname });

  if (pathname === "/") {
    const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
      window.history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
      onNavigate?.();
    };
    return (
      <a href={id === "home" ? "/" : `#${id}`} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to="/" {...(id === "home" ? {} : { hash: id })} className={className} onClick={onNavigate} {...rest}>
      {children}
    </Link>
  );
}
