import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-3xl">Not found</p>
      <p className="mt-2 text-body-sm text-muted-foreground">That page doesn&apos;t exist.</p>
      <Link href="/today" className="mt-6 text-body-sm underline underline-offset-4">
        Back to Today
      </Link>
    </div>
  );
}
