import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/admin/AdminShell";
import { setDraftPreview } from "@/hooks/use-portfolio";

/** Admin gate: must be signed in, and the database must confirm the admin role. */
export const Route = createFileRoute("/admin/_panel")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    const { data: isAdmin, error } = await supabase.rpc("is_admin");
    return { adminEmail: data.user.email ?? "", isAdmin: !error && isAdmin === true };
  },
  component: PanelLayout,
});

export function useAdminSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    setDraftPreview(false);
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/admin/login", replace: true });
  };
}

function PanelLayout() {
  const { isAdmin } = Route.useRouteContext();
  const signOut = useAdminSignOut();
  if (!isAdmin) {
    return (
      <AuthFrame eyebrow="Access denied" title="No admin access" description="This account isn't allowed to manage the portfolio.">
        <Button variant="ink" size="xl" className="w-full" onClick={() => void signOut()}>
          Sign out
        </Button>
      </AuthFrame>
    );
  }
  const { adminEmail } = Route.useRouteContext();
  return <AdminShell email={adminEmail} onSignOut={() => void signOut()}><Outlet /></AdminShell>;
}
