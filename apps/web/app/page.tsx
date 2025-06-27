"use client";

import type { JSX, KeyboardEvent } from "react";
import { useRef } from "react";
import { SquareMinus, SquarePlus, Trash2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { useStripStore } from "@web/store/strip-store";
import { Button } from "@workspace/ui/components/button"
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import Big from 'big.js';
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";


type GroupedStrips = Record<number, number>;
const unit = "cm";

function getTotalLength(stripLengths: number[]) {
  return stripLengths.reduce((sum, length) => {
    return Big(sum).plus(length).toNumber();
  }, 0);
}

export default function Page(): JSX.Element {
  const stripLengths = useStripStore(state => state.stripLengths);
  const addStrip = useStripStore(state => state.add);
  const removeStrip = useStripStore(state => state.remove);
  const removeAllStrips = useStripStore(state => state.removeAll);

  const stripWidth = useStripStore(state => state.stripWidth);
  const setStripWidth = useStripStore(state => state.setStripWidth);

  const roomSize = useStripStore(state => state.roomSize);
  const setRoomHeight = useStripStore(state => state.setRoomHeight);
  const setRoomWidth = useStripStore(state => state.setRoomWidth);

  const inputLengthRef = useRef<HTMLInputElement>(null);
  const inputCountRef = useRef<HTMLInputElement>(null);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      const lengthValue = inputLengthRef.current?.value;
      const countValue = inputCountRef.current?.value;
      if (lengthValue) {
        addStrip(
          Number(lengthValue),
          countValue ? Number(countValue) : 1,
        );
        if (inputLengthRef.current) inputLengthRef.current.value = "";
        if (inputCountRef.current) inputCountRef.current.value = "";
      }
      event.preventDefault();
    }
  };

  const groupedStripLength =
    stripLengths.reduce<GroupedStrips>(
      (acc: GroupedStrips, stripLength: number) => {
        return {
          ...acc,
          [stripLength]: (acc[stripLength] || 0) + 1,
        };
      },
      {},
    );

  const totalLength = getTotalLength(stripLengths);
  const roomArea = Big(roomSize.height).mul(roomSize.width).toNumber();
  const stripsArea = Big(totalLength).mul(stripWidth).toNumber();

  return (
    <main className="flex flex-col items-center min-h-screen p-8 max-w-4xl mx-auto">
      <div className="w-full mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Optimiseur de Découpe de Parquet</h1>
        <p className="text-muted-foreground">Calculez la disposition optimale de vos lames de parquet pour minimiser les chutes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="p-6 border rounded-lg dark:bg-gray-800 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Configuration de la pièce
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="room-width" className="text-sm font-medium min-w-[240px]">Longueur (sens des lames) en cm</label>
              <Input id="room-width" type="number" className="w-40 dark:bg-gray-600" value={roomSize.width} onChange={(e) => setRoomWidth(Number(e.currentTarget.value))} />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="room-height" className="text-sm font-medium min-w-[240px]">Largeur en cm</label>
              <Input id="room-height" type="number" className="w-40 dark:bg-gray-600" value={roomSize.height} onChange={(e) => setRoomHeight(Number(e.currentTarget.value))} />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Configuration des lames
          </h2>
          <div className="flex items-center justify-between">
            <label htmlFor="strips-width" className="text-sm font-medium min-w-[240px]">Largeur des lames en cm</label>
            <Input id="strips-width" type="number" className="w-40 dark:bg-gray-600" value={stripWidth} onChange={e => setStripWidth(Number(e.currentTarget.value))} />
          </div>
        </div>
      </div>

      <div className="w-full mt-6 p-6 border rounded-lg bg-card dark:bg-gray-800 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter des lames de parquet
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="strips-length" className="text-sm font-medium block mb-2">Longueur de la lame</label>
            <Input
              id="strips-length"
              className="w-full dark:bg-gray-600"
              ref={inputLengthRef}
              type="number"
              onKeyDown={onKeyDown}
              placeholder="Longueur en cm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="strips-count" className="text-sm font-medium block mb-2">Nombre de lames</label>
            <Input
              id="strips-count"
              className="w-full dark:bg-gray-600"
              type="number"
              ref={inputCountRef}
              placeholder="Quantité"
              onKeyDown={onKeyDown}
            />
          </div>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 h-10"
            onClick={() => {
              if (inputLengthRef.current?.value) {
                addStrip(
                  Number(inputLengthRef.current.value),
                  inputCountRef.current?.value
                    ? Number(inputCountRef.current.value)
                    : 1,
                );
              }
            }}
          >
            <SquarePlus className="mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-card dark:bg-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Lames ajoutées</h2>
          <ScrollArea className="h-72">
            {Object.entries(groupedStripLength)
              .sort((entriesA, entriesB) => Number(entriesA[0]) - Number(entriesB[0]))
              .map((groupedStripLengthItem) => (
                <div key={groupedStripLengthItem[0]} className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeStrip(Number(groupedStripLengthItem[0]))}
                  >
                    <SquareMinus size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => addStrip(Number(groupedStripLengthItem[0]))}
                  >
                    <SquarePlus size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeAllStrips(Number(groupedStripLengthItem[0]))}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <span className="flex-1">
                    {groupedStripLengthItem[1]} × {groupedStripLengthItem[0]} {unit}
                  </span>
                </div>
              ))}
          </ScrollArea>
        </div>

        <div className="p-6 border rounded-lg dark:bg-gray-800 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Résumé</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre total de lames</span>
              <span className="font-medium">{stripLengths.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Longueur totale</span>
              <span className="font-medium">{Big(totalLength).div(100).toFixed(2)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Superficie du parquet</span>
              <span className={cn("font-medium", stripsArea < roomArea ? "text-destructive" : "text-green-600")}>
                {Big(stripsArea).div(10000).toFixed(2)} m²
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Superficie de la pièce</span>
              <span className="font-medium">{Big(roomArea).div(10000).toFixed(2)} m²</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        asChild
        className="mt-8 w-full max-w-sm"
        disabled={stripsArea < roomArea}
        size="lg"
      >
        <Link href="/parquet-layout" className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
          Calculer la disposition
        </Link>
      </Button>
    </main>
  );
}
