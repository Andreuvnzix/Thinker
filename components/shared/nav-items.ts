import { CalendarDays, Inbox, LayoutList, MoreHorizontal, Settings, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Desktop rail: every primary surface. Mobile tab bar caps at 5 — see bottom-nav.tsx. */
export const navItems: NavItem[] = [
  { href: "/today", label: "Today", icon: Sun },
  { href: "/tasks", label: "Tasks", icon: LayoutList },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  { href: "/today", label: "Today", icon: Sun },
  { href: "/tasks", label: "Tasks", icon: LayoutList },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/settings", label: "More", icon: MoreHorizontal },
];
