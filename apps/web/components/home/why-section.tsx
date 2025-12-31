"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Clock, Eye, Gift, Scissors } from "lucide-react";

const benefits = [
  {
    icon: Scissors,
    title: "Réduction des chutes",
    description:
      "Minimisez les pertes de matériau grâce à un calcul optimisé de la disposition des lames.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description:
      "Économisez des heures de calculs manuels. L'outil fait le travail pour vous.",
  },
  {
    icon: Eye,
    title: "Visualisation claire",
    description:
      "Visualisez immédiatement le résultat avec une représentation graphique intuitive.",
  },
  {
    icon: Gift,
    title: "100% gratuit",
    description:
      "Accès complet à toutes les fonctionnalités sans frais ni inscription requise.",
  },
];

export function WhySection() {
  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pourquoi cet outil ?</h2>
          <p className="text-muted-foreground text-lg">
            Un outil conçu pour simplifier votre projet de pose de parquet
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
