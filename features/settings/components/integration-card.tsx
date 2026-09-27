import { cn } from "@/lib/utils";
import type { IntegrationStatus } from "@/lib/types/domain";

const STATUS_LABEL: Record<IntegrationStatus, string> = {
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
  needs_authorization: "Needs authorization",
};

export function IntegrationCard({
  name,
  description,
  status,
  actionLabel,
  actionDisabled,
  disabledReason,
}: {
  name: string;
  description: string;
  status: IntegrationStatus;
  actionLabel: string;
  actionDisabled?: boolean;
  disabledReason?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-body font-medium">{name}</p>
        <p className="text-body-sm text-muted-foreground">{description}</p>
        <p
          className={cn(
            "mt-1 text-[11px] font-medium tracking-wide",
            status === "connected" ? "text-foreground" : "text-muted-foreground",
            status === "error" && "text-accent-signal",
          )}
        >
          {STATUS_LABEL[status].toUpperCase()}
        </p>
      </div>
      <button
        disabled={actionDisabled}
        title={actionDisabled ? disabledReason : undefined}
        className="shrink-0 rounded-md border border-border px-3 py-1.5 text-body-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {actionLabel}
      </button>
    </div>
  );
}
