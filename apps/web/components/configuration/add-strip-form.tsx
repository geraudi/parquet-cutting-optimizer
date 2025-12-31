"use client";

import { useStripStore } from "@web/store/strip-store";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { SquarePlus } from "lucide-react";
import { type KeyboardEvent, useRef } from "react";

export function AddStripForm() {
  const addStrip = useStripStore((state) => state.add);
  const inputLengthRef = useRef<HTMLInputElement>(null);
  const inputCountRef = useRef<HTMLInputElement>(null);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      const lengthValue = inputLengthRef.current?.value;
      const countValue = inputCountRef.current?.value;
      if (lengthValue) {
        addStrip(Number(lengthValue), countValue ? Number(countValue) : 1);
        if (inputLengthRef.current) inputLengthRef.current.value = "";
        if (inputCountRef.current) inputCountRef.current.value = "";
      }
      event.preventDefault();
    }
  };

  const handleAdd = () => {
    if (inputLengthRef.current?.value) {
      addStrip(
        Number(inputLengthRef.current.value),
        inputCountRef.current?.value ? Number(inputCountRef.current.value) : 1
      );
      if (inputLengthRef.current) inputLengthRef.current.value = "";
      if (inputCountRef.current) inputCountRef.current.value = "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter des lames de parquet</CardTitle>
        <CardDescription>
          Entrez la longueur et la quantité de lames à ajouter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strips-length">Longueur de la lame (cm)</Label>
              <Input
                id="strips-length"
                ref={inputLengthRef}
                type="number"
                onKeyDown={onKeyDown}
                placeholder="Ex: 200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strips-count">Nombre de lames</Label>
              <Input
                id="strips-count"
                type="number"
                ref={inputCountRef}
                placeholder="Quantité"
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full">
            <SquarePlus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
