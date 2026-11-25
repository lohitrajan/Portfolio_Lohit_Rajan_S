import { usePortfolio } from "@/hooks/use-portfolio";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal as TerminalIcon, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { runCommand, type TerminalLine } from "@/lib/terminal";
import { cn } from "@/lib/utils";
import { ease } from "./motion";

type Entry = { id: number; command?: string; lines: TerminalLine[] };

const quick = ["help", "about", "skills", "projects", "education", "contact", "socials", "clear"];

const welcome: Entry = {
  id: 0,
  lines: [
    { text: "LOHIT.EXE — interactive portfolio shell v1.0", tone: "accent" },
    { text: 'Type "help" to see what I can tell you.', tone: "muted" },
  ],
};

export function Terminal() {
  const c = usePortfolio();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([welcome]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [entries]);

  const execute = (raw: string) => {
    const command = raw.trim();
    if (!command) return;
    const result = runCommand(command, c);
    setHistory((h) => [...h, command]);
    setCursor(-1);
    if (result.clear) {
      setEntries([]);
    } else {
      setEntries((e) => [...e, { id: idRef.current++, command, lines: result.lines }]);
    }
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === -1) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next] ?? "");
      }
    }
  };

  const openLink = (href: string) => {
    if (href.startsWith("/projects/")) {
      setOpen(false);
      navigate({ to: "/projects/$slug", params: { slug: href.replace("/projects/", "") } });
    } else if (href.startsWith("/#")) {
      setOpen(false);
      navigate({ to: "/", hash: href.slice(2) });
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="lohit-exe"
        className="fixed bottom-4 right-4 z-[60] flex h-11 items-center gap-2 rounded-full bg-terminal px-4 font-mono text-xs text-terminal-foreground shadow-lift transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <TerminalIcon className="size-4 text-accent" aria-hidden />
        LOHIT.EXE
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="lohit-exe"
            role="dialog"
            aria-label="LOHIT.EXE developer terminal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-x-3 bottom-20 z-[70] flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-terminal-border bg-terminal font-mono text-sm text-terminal-foreground shadow-lift sm:inset-x-auto sm:bottom-20 sm:right-6 sm:w-[560px]"
          >
            <div className="flex items-center justify-between border-b border-terminal-border px-4 py-3">
              <div className="flex items-center gap-2" aria-hidden>
                <span className="size-2.5 rounded-full bg-terminal-muted/50" />
                <span className="size-2.5 rounded-full bg-terminal-muted/50" />
                <span className="size-2.5 rounded-full bg-accent" />
              </div>
              <span className="text-xs text-terminal-muted">guest@lohit.exe: ~</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close terminal"
                className="rounded-md p-1 text-terminal-muted hover:text-terminal-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              ref={scrollRef}
              className="min-h-[220px] flex-1 overflow-y-auto px-4 py-4 leading-relaxed"
              onClick={() => inputRef.current?.focus()}
              aria-live="polite"
            >
              {entries.map((entry) => (
                <div key={entry.id} className="mb-3">
                  {entry.command ? (
                    <p>
                      <span className="text-accent">→</span> <span className="text-terminal-muted">~</span> {entry.command}
                    </p>
                  ) : null}
                  {entry.lines.map((line, i) =>
                    line.href ? (
                      <button
                        key={i}
                        type="button"
                        onClick={() => openLink(line.href!)}
                        className="block whitespace-pre-wrap text-left underline decoration-terminal-muted/40 underline-offset-4 hover:text-accent"
                      >
                        {line.text}
                      </button>
                    ) : (
                      <p
                        key={i}
                        className={cn(
                          "min-h-[1.25em] whitespace-pre-wrap break-words",
                          line.tone === "muted" && "text-terminal-muted",
                          line.tone === "accent" && "text-accent",
                          line.tone === "error" && "text-destructive",
                        )}
                      >
                        {line.text}
                      </p>
                    ),
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-accent">→</span>
                <span className="text-terminal-muted">~</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Terminal command"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-terminal-foreground caret-accent outline-none focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="scrollbar-none flex gap-2 overflow-x-auto border-t border-terminal-border px-4 py-3">
              {quick.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => execute(q)}
                  className="shrink-0 rounded-full border border-terminal-border px-3 py-1 text-xs text-terminal-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
