"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/components/shared/nav-items";

export function NavRail() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden md:flex md:w-16 md:flex-col md:items-center md:gap-1 md:border-r md:border-border md:py-4"
    >
      <Link href="/today" className="mb-4 flex h-9 w-9 items-center justify-center rounded-md">
        <span className="font-display text-lg leading-none">D</span>
      </Link>
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              active && "bg-secondary text-foreground",
            )}
          >
            <Icon size={19} strokeWidth={1.75} />
          </Link>
        );
      })}
    </nav>
  );
}
