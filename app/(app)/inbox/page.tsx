import { getInboxItems } from "@/lib/services/inbox";
import { InboxView } from "@/features/inbox/components/inbox-view";

export default async function InboxPage() {
  const items = await getInboxItems();
  return <InboxView initialItems={items} />;
}
