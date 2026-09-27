import { isGoogleOAuthConfigured, isSupabaseConfigured } from "@/lib/env";
import { IntegrationCard } from "@/features/settings/components/integration-card";
import { ThemeToggle } from "@/features/settings/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-10 md:px-8 md:pt-10">
      <h1 className="font-display text-display">Settings</h1>

      <section className="mt-8">
        <h2 className="text-micro font-semibold tracking-wide text-muted-foreground">INTEGRATIONS</h2>
        <div className="mt-2">
          <IntegrationCard
            name="Google Calendar"
            description="See your events on the Today timeline."
            status={isGoogleOAuthConfigured ? "needs_authorization" : "disconnected"}
            actionLabel="Connect"
            actionDisabled={!isGoogleOAuthConfigured}
            disabledReason="Google OAuth credentials are not configured yet."
          />
          <IntegrationCard
            name="Gmail"
            description="Surface important and unanswered emails."
            status={isGoogleOAuthConfigured ? "needs_authorization" : "disconnected"}
            actionLabel="Connect"
            actionDisabled={!isGoogleOAuthConfigured}
            disabledReason="Google OAuth credentials are not configured yet."
          />
        </div>
        {!isGoogleOAuthConfigured && (
          <p className="mt-2 text-body-sm text-muted-foreground">
            Requires a Google Cloud OAuth client — see PROJECT_STATUS.md for setup steps.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-micro font-semibold tracking-wide text-muted-foreground">APPEARANCE</h2>
        <div className="mt-2">
          <ThemeToggle />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-micro font-semibold tracking-wide text-muted-foreground">ACCOUNT</h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          {isSupabaseConfigured
            ? "Signed in via Supabase Auth."
            : "Running in local demo mode — no Supabase project connected yet."}
        </p>
      </section>
    </div>
  );
}
