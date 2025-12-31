"use client";

import { useStripStore } from "@web/store/strip-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { HelpCircle } from "lucide-react";

export function RoomConfig() {
  const roomSize = useStripStore((state) => state.roomSize);
  const setRoomWidth = useStripStore((state) => state.setRoomWidth);
  const setRoomHeight = useStripStore((state) => state.setRoomHeight);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Configuration de la pièce</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Indiquez les dimensions de la pièce à recouvrir en centimètres
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Dimensions de la pièce à recouvrir de parquet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="room-width">Longueur (sens des lames) en cm</Label>
          <Input
            id="room-width"
            type="number"
            value={roomSize.width || ""}
            onChange={(e) => setRoomWidth(Number(e.target.value))}
            placeholder="Ex: 500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room-height">Largeur en cm</Label>
          <Input
            id="room-height"
            type="number"
            value={roomSize.height || ""}
            onChange={(e) => setRoomHeight(Number(e.target.value))}
            placeholder="Ex: 400"
          />
        </div>
      </CardContent>
    </Card>
  );
}
