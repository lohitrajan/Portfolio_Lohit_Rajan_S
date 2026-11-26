import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthFrame } from "@/components/admin/AuthFrame";
import { EmailLinkForm } from "@/components/admin/EmailLinkForm";
import { adminHead } from "@/lib/admin/config";

export const Route = createFileRoute("/admin/setup")({
  head: adminHead("Set up admin access"),
  component: SetupPage,
});

function SetupPage() {
  return (
    <AuthFrame
      eyebrow="First-time setup"
      title="Set up your admin account"
      description="Enter the approved admin email. We'll send a secure link where you choose your password."
      footer={
        <Link to="/admin/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <EmailLinkForm submitLabel="Email me a setup link" initialEmail="lohitrajan@gmail.com" />
      <p className="mt-5 text-xs text-muted-foreground">
        Only the approved address can become an administrator. The link expires after a short time — request a new one if needed.
      </p>
    </AuthFrame>
  );
}
