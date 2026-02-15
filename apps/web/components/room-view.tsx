import { ParquetToolbar } from "@web/components/parquet-toolbar";
import Room from "@web/components/room";
import type { Room as RoomType, Strip } from "@web/lib/calculator";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

interface SavedVersion {
  date: string;
  calcResult: { rooms: RoomType[]; restStrips: Strip[] };
  roomSize: { width: number; height: number };
  stripLengths: number[];
}

interface RoomViewProps {
  rooms: RoomType[];
  isFullscreen: boolean;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;
  onRoomsChange?: (rooms: RoomType[]) => void;
  onOpenSidebar?: () => void;
  currentVersion?: {
    calcResult: { rooms: RoomType[]; restStrips: Strip[] };
    roomSize: { width: number; height: number };
    stripLengths: number[];
  };
  onLoadVersion?: (version: SavedVersion) => void;
}

export default function RoomView({
  rooms,
  isFullscreen,
  setIsFullscreen,
  onRoomsChange,
  onOpenSidebar,
  currentVersion,
  onLoadVersion,
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

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("Export PDF - À implémenter");
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 overflow-y-auto"
          : "overflow-x-auto overflow-y-auto relative"
      }
    >
      {!isFullscreen && (
        <div className="print:hidden p-6 border-b bg-linear-to-r from-slate-50 to-blue-50/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-linear-to-b from-blue-600 to-blue-400 rounded-full" />
                Vue d&apos;ensemble de la pièce
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Glissez les lames pour ajuster la disposition
              </p>
            </div>
          </div>
        </div>
      )}
      {isFullscreen && (
        <div className="print:hidden mb-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-linear-to-b from-blue-400 to-blue-600 rounded-full" />
                Vue d&apos;ensemble de la pièce
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Glissez les lames pour ajuster la disposition
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      <ParquetToolbar
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
        onOpenSidebar={onOpenSidebar}
        currentVersion={currentVersion}
        onLoadVersion={onLoadVersion}
      />

      <div
        className={
          isFullscreen
            ? "h-[calc(100vh-12rem)] p-8 bg-slate-800/30 rounded-lg"
            : "p-6 bg-linear-to-br from-slate-50/50 to-transparent"
        }
      >
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
