"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "@/components/shared/nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 backdrop-blur md:hidden"
    >
      {mobileNavItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground",
              active && "text-foreground",
            )}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.75} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
