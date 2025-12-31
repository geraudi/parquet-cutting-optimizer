"use client";

import { Sidebar } from "@web/components/layout/sidebar";
import RemainingStrips from "@web/components/remaining-strips";
import RoomView from "@web/components/room-view";
import { calculate, type Room, type Strip } from "@web/lib/calculator";
import { useStripStore } from "@web/store/strip-store";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Big from "big.js";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useState } from "react";

interface SavedVersion {
  date: string;
  calcResult: { rooms: Room[]; restStrips: Strip[] };
  roomSize: { width: number; height: number };
  stripLengths: number[];
}

export default function Page(): ReactNode {
  const roomSize = useStripStore((state) => state.roomSize);
  const stripLengths = useStripStore((state) => state.stripLengths);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [_calcKey, setCalcKey] = useState(0);
  const [calcResult, setCalcResult] = useState<{
    rooms: Room[];
    restStrips: Strip[];
  } | null>(null);
  const [calcError, setCalcError] = useState<Error | null>(null);
  const [latestRooms, setLatestRooms] = useState<Room[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const recalculate = useCallback(() => {
    setCalcKey((k) => k + 1);
  }, []);

  // Recalculate on every change of calcKey, roomSize or stripLengths
  useEffect(() => {
    try {
      const result = calculate([roomSize], stripLengths);
      setCalcResult(result);
      setCalcError(null);
    } catch (e) {
      setCalcResult(null);
      setCalcError(e as Error);
    }
  }, [roomSize, stripLengths]);

  // Listen to custom events to load versions from the toolbar
  useEffect(() => {
    const handleLoadVersion = (e: CustomEvent) => {
      try {
        const version = e.detail;
        setCalcResult(version.calcResult);
      } catch (error) {
        console.error("Error loading version:", error);
      }
    };

    window.addEventListener(
      "parquet-layout:load-version",
      handleLoadVersion as EventListener
    );
    return () =>
      window.removeEventListener(
        "parquet-layout:load-version",
        handleLoadVersion as EventListener
      );
  }, []);

  // Callback to load version from toolbar
  const handleLoadVersion = useCallback((version: SavedVersion) => {
    setCalcResult(version.calcResult);
  }, []);

  // Expose current version for toolbar SaveLoadMenu
  const currentVersion = calcResult
    ? {
        calcResult: {
          ...calcResult,
          rooms: latestRooms.length > 0 ? latestRooms : calcResult.rooms,
        },
        roomSize,
        stripLengths,
      }
    : undefined;

  if (calcError) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">
            Erreur de calcul
          </h1>
          <p className="text-muted-foreground">
            Impossible de calculer la disposition optimale. Veuillez vérifier
            vos données et réessayer.
          </p>
          <Button asChild className="mt-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à la configuration
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!calcResult) return null;
  const { rooms, restStrips } = calcResult;

  return (
    <>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onRecalculate={recalculate}
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        {/* Header Bar */}
        <div className="border-b bg-white/80 backdrop-blur-sm sticky top-16 z-40">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link
                    href="/configuration"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Configuration
                  </Link>
                </Button>
                <div className="h-5 w-px bg-border" />
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    Disposition optimale du parquet
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Ajustez la disposition en glissant les lames
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Toolbar moved to RoomView as floating element */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1800px] mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Left: Room View */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-2 shadow-xl bg-white/95">
                <RoomView
                  rooms={rooms}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                  onRoomsChange={setLatestRooms}
                  onOpenSidebar={() => setIsSidebarOpen(true)}
                  currentVersion={currentVersion}
                  onLoadVersion={handleLoadVersion}
                />
              </Card>
            </div>

            {/* Right: Stats Sidebar */}
            {!isFullscreen && (
              <div className="space-y-6">
                {/* Statistics Card */}
                <Card className="border-2 shadow-lg bg-gradient-to-br from-white to-slate-50/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
                  <CardHeader className="relative">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
                      Statistiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative">
                    <div className="group p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Superficie de la pièce
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900">
                        {Big(roomSize.height)
                          .mul(roomSize.width)
                          .div(10000)
                          .toFixed(2)}{" "}
                        <span className="text-sm text-muted-foreground">
                          m²
                        </span>
                      </div>
                    </div>
                    <div className="group p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Nombre total de lames
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900">
                        {stripLengths.length}
                      </div>
                    </div>
                    <div className="group p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                      <div className="text-xs text-muted-foreground mb-1">
                        Lames restantes
                      </div>
                      <div className="text-2xl font-bold font-mono text-slate-900">
                        {restStrips.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Remaining Strips Card */}
                <Card className="border-2 shadow-lg bg-white/95 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-amber-600 to-amber-400 rounded-full" />
                      Lames restantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RemainingStrips
                      strips={restStrips}
                      roomSizes={[roomSize]}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
