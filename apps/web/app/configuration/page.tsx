"use client";

import { AddStripForm } from "@web/components/configuration/add-strip-form";
import { RoomConfig } from "@web/components/configuration/room-config";
import { StripsConfig } from "@web/components/configuration/strips-config";
import { StripsList } from "@web/components/configuration/strips-list";
import { SummaryCard } from "@web/components/configuration/summary-card";
import { ImportExportControls } from "@web/components/import-export-controls";
import { useStripStore } from "@web/store/strip-store";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Big from "big.js";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export default function ConfigurationPage() {
  const stripLengths = useStripStore((state) => state.stripLengths);
  const stripWidth = useStripStore((state) => state.stripWidth);
  const roomSize = useStripStore((state) => state.roomSize);

  const totalLength = stripLengths.reduce((sum, length) => {
    return Big(sum).plus(length).toNumber();
  }, 0);
  const roomArea = Big(roomSize.height).mul(roomSize.width).toNumber();
  const stripsArea = Big(totalLength).mul(stripWidth).toNumber();

  const canCalculate = stripsArea >= roomArea && roomArea > 0;

  return (
    <main className="container mx-auto max-w-6xl py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration du calepinage</h1>
        <p className="text-muted-foreground text-lg">
          Configurez les dimensions de votre pièce et ajoutez vos lames de
          parquet pour obtenir une disposition optimisée.
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <CardTitle>Sauvegarde et restauration</CardTitle>
            </div>
            <CardDescription>
              Exportez ou importez votre configuration pour la réutiliser plus
              tard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImportExportControls />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RoomConfig />
        <StripsConfig />
      </div>

      <div className="mb-6">
        <AddStripForm />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StripsList />
        <SummaryCard />
      </div>

      <div className="flex justify-center">
        <Button
          asChild
          size="lg"
          className="text-lg px-8"
          disabled={!canCalculate}
        >
          <Link href="/parquet-layout" className="flex items-center gap-2">
            Calculer la disposition
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      {!canCalculate && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Veuillez remplir toutes les informations et vous assurer d'avoir
            suffisamment de matériau pour couvrir la pièce.
          </p>
        </div>
      )}
    </main>
  );
}
