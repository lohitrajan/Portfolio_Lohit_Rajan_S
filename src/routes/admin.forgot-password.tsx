import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { adminHead } from "@/lib/admin/config";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/forgot-password")({
  ssr: false,
  head: adminHead("Forgot password"),
  beforeLoad: () => {
    if (isAdminAuthenticated()) {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthFrame
      eyebrow="Password help"
      title="Password is fixed"
      description="Admin login uses a hardcoded password. Password reset is not available."
      footer={
        <Link to="/admin/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground">
        If you need to change the admin password, update it in the project source under{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-xs">src/lib/admin/auth.ts</code>.
      </p>
    </AuthFrame>
  );
}
