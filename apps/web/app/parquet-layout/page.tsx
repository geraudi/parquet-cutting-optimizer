"use client"

import { type JSX, useState, useCallback, useEffect } from "react";
import { calculate, Room, Strip } from "@web/lib/calculator";
import RemainingStrips from "@web/components/remaining-strips";
import { useStripStore } from "@web/store/strip-store";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Big from 'big.js';
import RoomView from "@web/components/room-view";

export default function Page(): JSX.Element {
  const roomSize = useStripStore(state => state.roomSize);
  const stripLengths = useStripStore(state => state.stripLengths);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [calcKey, setCalcKey] = useState(0);
  const [calcResult, setCalcResult] = useState<{ rooms: Room[]; restStrips: Strip[] } | null>(null);
  const [calcError, setCalcError] = useState<Error | null>(null);

  const recalculate = useCallback(() => {
    setCalcKey(k => k + 1);
  }, []);

  // Recalcule à chaque changement de calcKey, roomSize ou stripLengths
  useEffect(() => {
    try {
      const result = calculate([roomSize], stripLengths);
      setCalcResult(result);
      setCalcError(null);
    } catch (e) {
      setCalcResult(null);
      setCalcError(e as Error);
    }
  }, [calcKey, roomSize, stripLengths]);

  if (calcError) {
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

  if (!calcResult) return <></>;
  const { rooms, restStrips } = calcResult;

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
          <p className="text-muted-foreground">Voici une disposition calculée pour votre pièce</p>
          <div className="flex justify-center mt-4">
            <Button onClick={recalculate} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Recalculer
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="p-6 border rounded-lg bg-card shadow-sm">
          <RoomView rooms={rooms} isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
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
                  <span className="font-medium">{Big(roomSize.height).mul(roomSize.width).div(10000).toFixed(2)} cm²</span>
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
}
