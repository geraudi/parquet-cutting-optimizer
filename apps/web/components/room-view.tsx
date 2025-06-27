import Room from "@web/components/room";
import { Button } from "@workspace/ui/components/button";
import { Maximize2, Minimize2 } from "lucide-react";
import type { Room as RoomType } from "@web/lib/calculator";
import type { Dispatch, SetStateAction } from "react";

interface RoomViewProps {
    rooms: RoomType[];
    isFullscreen: boolean;
    setIsFullscreen: Dispatch<SetStateAction<boolean>>;
}

export default function RoomView({ rooms, isFullscreen, setIsFullscreen }: RoomViewProps) {
    return (
        <div className={isFullscreen ? "fixed inset-0 z-50 bg-background p-4 overflow-y-auto" : "overflow-x-auto overflow-y-auto"}>
            {!isFullscreen && (
                <div className="flex items-center justify-between mb-4 print:hidden">
                    <h2 className="text-xl font-semibold">Vue d&apos;ensemble de la pièce</h2>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFullscreen(true)}
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
            {isFullscreen && (
                <div className="flex items-center justify-between mb-4 print:hidden">
                    <h2 className="text-xl font-semibold">Vue d&apos;ensemble de la pièce</h2>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <Minimize2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
            <div className={isFullscreen ? "h-[calc(100vh-8rem)]" : ""}>
                {rooms.map((room) => (
                    <Room room={room} key={room.id} />
                ))}
            </div>
        </div>
    );
} 