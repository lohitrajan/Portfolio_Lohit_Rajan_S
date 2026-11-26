import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthFrame, FormMessage } from "@/components/admin/AuthFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeAdminRedirect } from "@/lib/admin/forms";
import { adminHead } from "@/lib/admin/config";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {},
  head: adminHead("Sign in"),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in as admin: go straight to the dashboard.
  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (alive && isAdmin) void navigate({ href: safeAdminRedirect(redirect), replace: true });
    })();
    return () => {
      alive = false;
    };
  }, [navigate, redirect]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setBusy(false);
      setError(
        /email not confirmed/i.test(signInError.message)
          ? "This account hasn't been confirmed yet. Use the setup link from your email first."
          : /invalid/i.test(signInError.message)
            ? "That email and password don't match."
            : "Sign-in failed. Please try again.",
      );
      return;
    }
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) {
      await supabase.auth.signOut();
      setBusy(false);
      setError("This account doesn't have admin access.");
      return;
    }
    void navigate({ href: safeAdminRedirect(redirect), replace: true });
  }

  return (
    <AuthFrame
      eyebrow="Portfolio admin"
      title="Sign in"
      description="Manage the content of your portfolio."
      footer={
        <>
          First time here?{" "}
          <Link to="/admin/setup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Set up your admin account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {error ? <FormMessage tone="error">{error}</FormMessage> : null}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/admin/forgot-password" className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" variant="ink" size="xl" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : null}
          Sign in
        </Button>
      </form>
    </AuthFrame>
  );
}
