/**
 * Until a real Supabase project + Google OAuth app exist (see PROJECT_STATUS.md,
 * "Requires user action"), the app runs against local fixture data so the UI can
 * be built and visually reviewed. Every data-access function in `lib/services`
 * checks `isSupabaseConfigured` and falls back to fixtures when it's false.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const isGoogleOAuthConfigured = Boolean(
  process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET,
);
