"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Calculator, Info, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Outil de calepinage", href: "/configuration", icon: Calculator },
  { name: "Blog", href: "/blog", icon: Newspaper },
  { name: "À propos", href: "/about", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/opti-parquet-logo.svg"
            alt="Opti Parquet"
            width={225}
            height={58}
            className="h-16 w-auto mt-6"
            priority
          />
        </Link>

        <nav className="flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn("gap-2", isActive && "bg-secondary")}
              >
                <Link href={item.href} className="flex items-center">
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
          <Button asChild className="ml-4">
            <Link href="/configuration" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculer
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
