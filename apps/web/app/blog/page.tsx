"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function BlogPage() {
  return (
    <main className="container mx-auto max-w-4xl py-8 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground text-lg">
          Guides et conseils pour la pose de parquet
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Articles à venir</CardTitle>
            <CardDescription>
              Du contenu sera bientôt disponible ici
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Nous préparons des articles sur :
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
              <li>Comment poser un parquet à l&apos;anglaise</li>
              <li>Comment calculer les chutes</li>
              <li>Différences entre types de poses</li>
              <li>Erreurs fréquentes en pose de parquet</li>
              <li>Guides pour débutants</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
