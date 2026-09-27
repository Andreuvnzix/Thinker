import type { ReactNode } from "react";
import { NavRail } from "@/components/shared/nav-rail";
import { BottomNav } from "@/components/shared/bottom-nav";
import { MobileTopBar } from "@/components/shared/mobile-topbar";
import { CommandBar } from "@/features/command-bar/components/command-bar";
import { CommandBarProvider } from "@/features/command-bar/components/command-bar-context";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CommandBarProvider>
      <div className="flex min-h-dvh">
        <NavRail />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="min-h-0 flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
        </div>
        <BottomNav />
      </div>
      <CommandBar />
    </CommandBarProvider>
  );
}
