"use client";

import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "openid email profile",
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="font-display text-3xl">Daily OS</p>
        <p className="mt-2 text-body-sm text-muted-foreground">
          Your day, at a glance — tasks, calendar, and email in one place.
        </p>

        <Button className="mt-8 w-full" size="lg" onClick={signInWithGoogle} disabled={!isSupabaseConfigured}>
          Continue with Google
        </Button>

        {!isSupabaseConfigured && (
          <p className="mt-3 text-body-sm text-muted-foreground">
            Sign-in is disabled until the Supabase project and Google OAuth client are configured — see
            PROJECT_STATUS.md.
          </p>
        )}
        {error && <p className="mt-3 text-body-sm text-accent-signal">{error}</p>}
      </div>
    </div>
  );
}
