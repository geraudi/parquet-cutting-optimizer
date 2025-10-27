import Room from "@web/components/room";
import type { Room as RoomType } from "@web/lib/calculator";
import { Button } from "@workspace/ui/components/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface RoomViewProps {
  rooms: RoomType[];
  isFullscreen: boolean;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;
  onRoomsChange?: (rooms: RoomType[]) => void;
}

export default function RoomView({
  rooms,
  isFullscreen,
  setIsFullscreen,
  onRoomsChange,
}: RoomViewProps) {
  const [localRooms, setLocalRooms] = useState<RoomType[]>(rooms);

  // Sync localRooms with incoming rooms prop
  useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

  // Notify parent on change
  useEffect(() => {
    if (onRoomsChange) onRoomsChange(localRooms);
  }, [localRooms, onRoomsChange]);

  const handleRowsChange = (roomId: string, newRows: RoomType["rows"]) => {
    setLocalRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, rows: newRows } : r))
    );
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-background p-4 overflow-y-auto"
          : "overflow-x-auto overflow-y-auto"
      }
    >
      {!isFullscreen && (
        <div className="print:hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              Vue d&apos;ensemble de la pièce
            </h2>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="mb-4">
            Ajustez la disposition des lames de parquet en les déplaçant.
          </p>
        </div>
      )}
      {isFullscreen && (
        <div className="print:hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              Vue d&apos;ensemble de la pièce
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="mb-4">
            Ajustez la disposition des lames de parquet en les déplaçant.
          </p>
        </div>
      )}
      <div className={isFullscreen ? "h-[calc(100vh-8rem)]" : ""}>
        {localRooms.map((room) => (
          <Room
            room={room}
            key={room.id}
            onRowsChange={(rows) => handleRowsChange(room.id, rows)}
          />
        ))}
      </div>
    </div>
  );
}
