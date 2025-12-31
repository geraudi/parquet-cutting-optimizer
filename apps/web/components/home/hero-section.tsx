"use client";

import { Button } from "@workspace/ui/components/button";
import { Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Optimisez la pose de votre parquet
            </h1>
            <p className="text-xl text-muted-foreground">
              Calculez automatiquement le calepinage de votre parquet pour
              minimiser les chutes et optimiser votre projet. Un outil simple,
              gratuit et efficace pour particuliers et professionnels.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/configuration" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculer mon calepinage
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-square max-w-lg mx-auto">
              <Image
                src="/images/optimization-diagram.png"
                alt="Diagramme d'optimisation de découpe de parquet"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
