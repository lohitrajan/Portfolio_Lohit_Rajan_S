import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthFrame, FormMessage } from "@/components/admin/AuthFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminHead } from "@/lib/admin/config";

export const Route = createFileRoute("/admin/reset-password")({
  ssr: false,
  head: adminHead("Choose a new password"),
  component: ResetPasswordPage,
});

type Phase = "checking" | "ready" | "invalid" | "done";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("checking");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const problem = hash.get("error_description") ?? query.get("error_description");
    if (problem) {
      setLinkError(problem.replace(/\+/g, " "));
      setPhase("invalid");
      return;
    }
    const linkType = hash.get("type") ?? query.get("type");
    const isSetupOrRecovery = linkType === "recovery" || linkType === "invite" || linkType === "signup";
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || (isSetupOrRecovery && (event === "SIGNED_IN" || event === "INITIAL_SESSION")))) {
        setPhase((p) => (p === "checking" ? "ready" : p));
      }
    });
    void supabase.auth.getSession().then(({ data: s }) => {
      if (s.session && isSetupOrRecovery) setPhase((p) => (p === "checking" ? "ready" : p));
    });
    const timer = window.setTimeout(() => setPhase((p) => (p === "checking" ? "invalid" : p)), 5000);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setBusy(false);
      setError(
        /pwned|breach|weak|known/i.test(updateError.message)
          ? "That password has appeared in a data breach. Please choose a different one."
          : /same/i.test(updateError.message)
            ? "Choose a password different from your current one."
            : "The password couldn't be saved. Request a new link and try again.",
      );
      return;
    }
    const { data: isAdmin } = await supabase.rpc("is_admin");
    setBusy(false);
    setPhase("done");
    if (isAdmin) void navigate({ to: "/admin/dashboard", replace: true });
  }

  if (phase === "checking") {
    return (
      <AuthFrame eyebrow="Secure link" title="Checking your link…">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> One moment.
        </div>
      </AuthFrame>
    );
  }

  if (phase === "invalid") {
    return (
      <AuthFrame
        eyebrow="Secure link"
        title="This link can't be used"
        description="It may have expired or already been used."
        footer={
          <Link to="/admin/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        }
      >
        {linkError ? <FormMessage tone="error">{linkError}</FormMessage> : null}
        <Button asChild variant="ink" size="xl" className="mt-4 w-full">
          <Link to="/admin/forgot-password">Request a new link</Link>
        </Button>
      </AuthFrame>
    );
  }

  if (phase === "done") {
    return (
      <AuthFrame eyebrow="All set" title="Password saved">
        <FormMessage tone="success">Your password has been updated.</FormMessage>
        <Button asChild variant="ink" size="xl" className="mt-4 w-full">
          <Link to="/admin/dashboard">Open the dashboard</Link>
        </Button>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame eyebrow="Secure link" title="Choose a password" description="Use at least 8 characters. You'll use it to sign in to the dashboard.">
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" variant="ink" size="xl" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          Save password
        </Button>
      </form>
    </AuthFrame>
  );
}
