"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Layout, Move, Plus, Ruler } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Ruler,
    title: "Renseignez votre pièce",
    description: "Indiquez les dimensions de la pièce à recouvrir",
  },
  {
    number: 2,
    icon: Plus,
    title: "Ajoutez vos lames",
    description: "Entrez la longueur et la quantité de vos lames de parquet",
  },
  {
    number: 3,
    icon: Layout,
    title: "Obtenez une disposition optimisée",
    description:
      "L'algorithme calcule automatiquement la meilleure disposition",
  },
  {
    number: 4,
    icon: Move,
    title: "Ajustez manuellement si besoin",
    description:
      "Déplacez les lames par drag & drop pour personnaliser le résultat",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
          <p className="text-muted-foreground text-lg">
            En 4 étapes simples, obtenez votre calepinage optimisé
          </p>
        </div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  <Card className="shadow-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                            {step.number}
                          </div>
                          <div className="p-4 rounded-full bg-primary/10">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border z-10 transform -translate-y-1/2">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-border border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
