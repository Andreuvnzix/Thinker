import Link from "next/link";
import { relativeTimeFromNow } from "@/lib/utils/time";
import type { Email } from "@/lib/types/domain";

export function ImportantEmails({ emails }: { emails: Email[] }) {
  if (emails.length === 0) {
    return <p className="text-body-sm text-muted-foreground">Inbox is quiet — nothing urgent.</p>;
  }

  return (
    <div className="divide-y divide-border">
      {emails.map((email) => (
        <Link
          key={email.id}
          href={`/inbox?email=${email.id}`}
          className="flex min-h-11 items-baseline justify-between gap-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate text-body font-medium">{email.senderName ?? email.senderEmail}</p>
            <p className="truncate text-body-sm text-muted-foreground">{email.subject}</p>
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">{relativeTimeFromNow(email.receivedAt)}</span>
        </Link>
      ))}
    </div>
  );
}
