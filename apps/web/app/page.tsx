"use client";

import { FeaturesSection } from "@web/components/home/features-section";
import { HeroSection } from "@web/components/home/hero-section";
import { HowItWorksSection } from "@web/components/home/how-it-works-section";
import { WhySection } from "@web/components/home/why-section";
import { Button } from "@workspace/ui/components/button";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <WhySection />
      <HowItWorksSection />
      <FeaturesSection />
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              Prêt à optimiser votre projet ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Commencez dès maintenant et obtenez votre calepinage en quelques
              minutes
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/configuration" className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculer mon calepinage
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
