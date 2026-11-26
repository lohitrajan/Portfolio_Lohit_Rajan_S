import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { EmailLinkForm } from "@/components/admin/EmailLinkForm";
import { adminHead } from "@/lib/admin/config";

export const Route = createFileRoute("/admin/forgot-password")({
  head: adminHead("Forgot password"),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthFrame
      eyebrow="Password help"
      title="Forgot your password?"
      description="Enter your admin email and we'll send a link to choose a new password."
      footer={
        <Link to="/admin/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <EmailLinkForm submitLabel="Email me a reset link" />
    </AuthFrame>
  );
}
