"use client";

import { BarChart3, Grid3x3, GripVertical, Save } from "lucide-react";

const features = [
  {
    icon: Grid3x3,
    name: "Pose à l'anglaise",
    description: "Optimisation pour la pose en décalé",
  },
  {
    icon: GripVertical,
    name: "Drag & drop",
    description: "Ajustement manuel par glisser-déposer",
  },
  {
    icon: Save,
    name: "Sauvegarde",
    description: "Enregistrez plusieurs versions de votre projet",
  },
  {
    icon: BarChart3,
    name: "Statistiques détaillées",
    description: "Suivez les chutes et l'utilisation du matériau",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités clés</h2>
          <p className="text-muted-foreground text-lg">
            Tout ce dont vous avez besoin pour optimiser votre projet
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.name}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm"
              >
                <div className="p-3 rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
