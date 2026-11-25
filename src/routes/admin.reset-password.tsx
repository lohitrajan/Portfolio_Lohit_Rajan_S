import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { adminHead } from "@/lib/admin/config";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin/reset-password")({
  ssr: false,
  head: adminHead("Reset password"),
  beforeLoad: () => {
    if (isAdminAuthenticated()) {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return (
    <AuthFrame
      eyebrow="Password help"
      title="Password is fixed"
      description="Admin login uses a hardcoded password. Online password reset is not available."
      footer={
        <Link to="/admin/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground">
        Change the password in{" "}
        <code className="rounded bg-secondary px-1 py-0.5 text-xs">src/lib/admin/auth.ts</code> if needed.
      </p>
    </AuthFrame>
  );
}
