import type { ReactNode } from "react";

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="py-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-micro font-semibold tracking-wide text-muted-foreground">{title.toUpperCase()}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
