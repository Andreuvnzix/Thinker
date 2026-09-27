"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Inbox, LayoutList, Plus, Search, Settings, Sun } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandBar } from "@/features/command-bar/components/command-bar-context";

export function CommandBar() {
  const { open, setOpen } = useCommandBar();
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  function go(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command menu" description="Jump anywhere or capture something quickly">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick capture">
          <CommandItem onSelect={() => go("/inbox?capture=1")}>
            <Plus /> Capture to Inbox
          </CommandItem>
          <CommandItem onSelect={() => go("/tasks?new=1")}>
            <LayoutList /> New task
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => go("/today")}>
            <Sun /> Today
          </CommandItem>
          <CommandItem onSelect={() => go("/tasks")}>
            <LayoutList /> Tasks
          </CommandItem>
          <CommandItem onSelect={() => go("/calendar")}>
            <CalendarDays /> Calendar
          </CommandItem>
          <CommandItem onSelect={() => go("/inbox")}>
            <Inbox /> Inbox
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Search">
          <CommandItem onSelect={() => go("/search")}>
            <Search /> Search everything
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
