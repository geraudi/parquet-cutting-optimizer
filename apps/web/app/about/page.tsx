"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">À propos</h1>
        <p className="text-muted-foreground text-lg">
          En savoir plus sur cet outil de calepinage de parquet
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Qu&apos;est-ce qu&apos;Opti Parquet ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Opti Parquet est un outil gratuit et simple permettant de calculer
              automatiquement le calepinage de parquet pour une pose à
              l&apos;anglaise. L&apos;objectif est de minimiser les chutes et
              d&apos;optimiser l&apos;utilisation de vos lames de parquet.
            </p>
            <p>
              Cet outil s&apos;adresse aux particuliers, bricoleurs avertis et
              professionnels qui souhaitent optimiser leur projet de pose de
              parquet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Calcul automatique du calepinage optimisé</li>
              <li>Visualisation graphique de la disposition</li>
              <li>Ajustement manuel par drag & drop</li>
              <li>Sauvegarde de plusieurs versions</li>
              <li>Statistiques détaillées (chutes, superficie)</li>
              <li>Import/Export de configuration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gratuit et sans inscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              L&apos;outil est entièrement gratuit et ne nécessite aucune
              inscription. Toutes les fonctionnalités sont accessibles
              immédiatement.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/configuration" className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Utiliser l&apos;outil
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
