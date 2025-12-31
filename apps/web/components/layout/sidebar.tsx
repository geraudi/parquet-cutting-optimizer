"use client";

import { ImportExportControls } from "@web/components/import-export-controls";
import { useStripStore } from "@web/store/strip-store";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { cn } from "@workspace/ui/lib/utils";
import { RotateCcw, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onRecalculate: () => void;
}

export function Sidebar({ isOpen, onClose, onRecalculate }: SidebarProps) {
  const roomSize = useStripStore((state) => state.roomSize);
  const setRoomWidth = useStripStore((state) => state.setRoomWidth);
  const setRoomHeight = useStripStore((state) => state.setRoomHeight);
  const stripWidth = useStripStore((state) => state.stripWidth);
  const setStripWidth = useStripStore((state) => state.setStripWidth);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-96 bg-background border-l z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Paramètres</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Configuration de la pièce
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sidebar-room-width">
                  Longueur (sens des lames) en cm
                </Label>
                <Input
                  id="sidebar-room-width"
                  type="number"
                  value={roomSize.width || ""}
                  onChange={(e) => setRoomWidth(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sidebar-room-height">Largeur en cm</Label>
                <Input
                  id="sidebar-room-height"
                  type="number"
                  value={roomSize.height || ""}
                  onChange={(e) => setRoomHeight(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Configuration des lames
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="sidebar-strips-width">
                  Largeur des lames en cm
                </Label>
                <Input
                  id="sidebar-strips-width"
                  type="number"
                  value={stripWidth || ""}
                  onChange={(e) => setStripWidth(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-4">
            <Button
              onClick={onRecalculate}
              className="w-full"
              variant="default"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Recalculer
            </Button>
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Import / Export</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportExportControls />
            </CardContent>
          </Card>
        </div>
      </aside>
    </>
  );
}
