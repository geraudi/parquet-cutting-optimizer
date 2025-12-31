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

export function StripsConfig() {
  const stripWidth = useStripStore((state) => state.stripWidth);
  const setStripWidth = useStripStore((state) => state.setStripWidth);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration des lames</CardTitle>
        <CardDescription>
          Largeur des lames de parquet en centimètres
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="strips-width">Largeur des lames en cm</Label>
          <Input
            id="strips-width"
            type="number"
            value={stripWidth || ""}
            onChange={(e) => setStripWidth(Number(e.target.value))}
            placeholder="Ex: 13"
          />
        </div>
      </CardContent>
    </Card>
  );
}
