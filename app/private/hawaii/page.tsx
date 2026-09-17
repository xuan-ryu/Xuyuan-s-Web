import type { Metadata } from "next";
import { TravelUnlock } from "@/components/travel-unlock";

// Private travel record — L3 route wiring. Search engines are explicitly
// excluded; the page contains only the unlock interface, while the itinerary
// remains encrypted until the browser derives its key.
export const metadata: Metadata = {
  title: "Private Travel Notes",
  description: "A private encrypted travel notebook.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function HawaiiTravelPage() {
  return <TravelUnlock />;
}
