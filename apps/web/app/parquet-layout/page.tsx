"use client"

import { type JSX, useState } from "react";
import Room from "@web/components/room";
import { calculate } from "@web/lib/calculator";
import RemainingStrips from "@web/components/remaining-strips";
import { useStripStore } from "@web/store/strip-store";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import Big from 'big.js';

export default function Page(): JSX.Element {
  const roomSize = useStripStore(state => state.roomSize);
  const stripLengths = useStripStore(state => state.stripLengths);
  const [isFullscreen, setIsFullscreen] = useState(false);

  try {
    const { rooms, restStrips } = calculate([roomSize], stripLengths);

    const RoomView = () => (
      <div className={isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : "overflow-x-auto overflow-y-auto max-h-[600px]"}>
        {!isFullscreen && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Vue d'ensemble de la pièce</h2>
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Vue d'ensemble de la pièce</h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className={isFullscreen ? "h-[calc(100vh-8rem)] overflow-auto" : ""}>
          {rooms.map((room) => (
            <Room room={room} key={room.id} />
          ))}
        </div>
      </div>
    );

    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à la configuration
            </Link>
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Disposition optimale du parquet</h1>
            <p className="text-muted-foreground">Voici la disposition optimale calculée pour votre pièce</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <RoomView />
          </div>

          {!isFullscreen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Lames restantes</h2>
                <RemainingStrips strips={restStrips} roomSizes={[roomSize]} />
              </div>

              <div className="p-6 border rounded-lg bg-card shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Superficie de la pièce</span>
                    <span className="font-medium">{Big(roomSize.height).mul(roomSize.width).toNumber()} cm²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre total de lames</span>
                    <span className="font-medium">{stripLengths.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lames restantes</span>
                    <span className="font-medium">{restStrips.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  } catch (e) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">Erreur de calcul</h1>
          <p className="text-muted-foreground">Impossible de calculer la disposition optimale. Veuillez vérifier vos données et réessayer.</p>
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
}
