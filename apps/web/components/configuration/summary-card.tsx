"use client";

import { useStripStore } from "@web/store/strip-store";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import Big from "big.js";

function getTotalLength(stripLengths: number[]) {
  return stripLengths.reduce((sum, length) => {
    return Big(sum).plus(length).toNumber();
  }, 0);
}

export function SummaryCard() {
  const stripLengths = useStripStore((state) => state.stripLengths);
  const stripWidth = useStripStore((state) => state.stripWidth);
  const roomSize = useStripStore((state) => state.roomSize);

  const totalLength = getTotalLength(stripLengths);
  const roomArea = Big(roomSize.height).mul(roomSize.width).toNumber();
  const stripsArea = Big(totalLength).mul(stripWidth).toNumber();

  const isReady = stripsArea >= roomArea && roomArea > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé</CardTitle>
        <CardDescription>
          Vérifiez que vous avez suffisamment de matériau
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Nombre total de lames</span>
          <span className="font-medium">{stripLengths.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Longueur totale</span>
          <span className="font-medium">
            {Big(totalLength).div(100).toFixed(2)} m
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Superficie du parquet</span>
          <span
            className={cn(
              "font-medium",
              stripsArea < roomArea ? "text-destructive" : "text-green-600"
            )}
          >
            {Big(stripsArea).div(10000).toFixed(2)} m²
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Superficie de la pièce</span>
          <span className="font-medium">
            {Big(roomArea).div(10000).toFixed(2)} m²
          </span>
        </div>
        {isReady && (
          <div className="pt-2">
            <Badge className="w-full justify-center" variant="default">
              ✓ Prêt pour le calcul
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
