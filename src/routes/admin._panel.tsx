import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/admin/AdminShell";
import { setDraftPreview } from "@/hooks/use-portfolio";
import { getAdminSession, isAdminAuthenticated, logoutAdmin, ADMIN_EMAIL } from "@/lib/admin/auth";

/** Admin gate: must be signed in via local admin session. */
export const Route = createFileRoute("/admin/_panel")({
  ssr: false,
  beforeLoad: ({ location }) => {
    if (!isAdminAuthenticated()) {
      throw redirect({ to: "/admin/login", search: { redirect: location.href } });
    }
    const session = getAdminSession();
    return { adminEmail: session?.email ?? ADMIN_EMAIL, isAdmin: true };
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
    logoutAdmin();
    void navigate({ to: "/admin/login", replace: true });
  };
}

function PanelLayout() {
  const { isAdmin, adminEmail } = Route.useRouteContext();
  const signOut = useAdminSignOut();
  if (!isAdmin) {
    return (
      <AuthFrame
        eyebrow="Access denied"
        title="No admin access"
        description="This account isn't allowed to manage the portfolio."
      >
        <Button variant="ink" size="xl" className="w-full" onClick={() => void signOut()}>
          Sign out
        </Button>
      </AuthFrame>
    );
  }
  return (
    <AdminShell email={adminEmail} onSignOut={() => void signOut()}>
      <Outlet />
    </AdminShell>
  );
}
