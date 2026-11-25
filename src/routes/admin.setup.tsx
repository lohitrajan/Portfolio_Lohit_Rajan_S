import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { adminHead } from "@/lib/admin/config";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/setup")({
  ssr: false,
  head: adminHead("Set up admin access"),
  beforeLoad: () => {
    if (isAdminAuthenticated()) {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: SetupPage,
});

function SetupPage() {
  return (
    <AuthFrame
      eyebrow="Admin access"
      title="Credentials are fixed"
      description="Admin login uses a single hardcoded email and password. No account setup is required."
      footer={
        <Link to="/admin/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Go to sign in
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground">
        Use the email and password configured in the project to sign in to the admin portal.
      </p>
    </AuthFrame>
  );
}
