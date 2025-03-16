"use client"

import { type JSX } from "react";
import Room from "@web/components/room";
import { calculate } from "@web/lib/calculator";
import RemainingStrips from "@web/components/remaining-strips";
import { useStripStore } from "@web/store/strip-store";

export default function Page(): JSX.Element {
  const roomSize = useStripStore(state => state.roomSize);
  const stripLengths = useStripStore(state => state.stripLengths);

  try {
    const { rooms, restStrips } = calculate([roomSize], stripLengths);

    return (
      <main className="p-8">
        <div>
          {rooms.map((room) => (
            <Room room={room} key={room.id} />
          ))}
        </div>
        <RemainingStrips strips={restStrips} roomSizes={[roomSize]} />
      </main>
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return (
      <main className="flex flex-col items-center justify-between min-h-screen p-24">
        <div className="text-red-500">
          Failed to calculate layout. Please try again.
        </div>
      </main>
    );
  }
}
