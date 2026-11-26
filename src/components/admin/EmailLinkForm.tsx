import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { requestAdminSetup } from "@/lib/admin/setup.functions";
import { FormMessage } from "./AuthFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMAIL } from "@/lib/admin/forms";

/** Asks the server to email a setup / reset link; the reply never reveals whether the address is approved. */
export function EmailLinkForm({ submitLabel, initialEmail = "" }: { submitLabel: string; initialEmail?: string }) {
  const send = useServerFn(requestAdminSetup);
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setResult({ ok: false, message: "Please enter a valid email address." });
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      setResult(await send({ data: { email: email.trim() } }));
    } catch {
      setResult({ ok: false, message: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {result ? <FormMessage tone={result.ok ? "success" : "error"}>{result.message}</FormMessage> : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" variant="ink" size="xl" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="animate-spin" /> : null}
        {submitLabel}
      </Button>
    </form>
  );
}
