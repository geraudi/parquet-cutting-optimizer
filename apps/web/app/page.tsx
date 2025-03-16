"use client";

import type { JSX, KeyboardEvent } from "react";
import { useRef } from "react";
import { SquareMinus, SquarePlus } from "lucide-react";
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

  const stripWidth = useStripStore(state => state.stripWidth);
  const setStripWidth = useStripStore(state => state.setStripWidth);

  const roomSize = useStripStore(state => state.roomSize);
  const setRoomHeight = useStripStore(state => state.setRoomHeight);
  const setRoomWidth = useStripStore(state => state.setRoomWidth);

  const inputLengthRef = useRef<HTMLInputElement>(null);
  const inputCountRef = useRef<HTMLInputElement>(null);

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      const value = (event.target as HTMLInputElement).value;

      addStrip(Number(value));
      if (inputLengthRef.current) {
        inputLengthRef.current.value = "";
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
    <main className="flex flex-col items-start min-h-screen p-14">

      <div className="p-4 border border-spacing bg-primary-foreground rounded-md w-full mb-4">
        <h1 className="font-bold text-&xl mb-8">Configuration de la pièce</h1>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-end">
            <label htmlFor="room-width" className="mr-2 text-right w-72">Longueur (sens des lames de parquet) :</label>
            <Input id="room-width" type="number" className="w-24" value={roomSize.width} onChange={(e) => setRoomWidth(Number(e.currentTarget.value))} />
          </div>
          <div className="flex items-center justify-end">
            <label htmlFor="room-height" className="mr-2 text-right w-80">Largeur :</label>
            <Input id="room-height" type="number" className="w-24" value={roomSize.height} onChange={(e) => setRoomHeight(Number(e.currentTarget.value))} />
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 border border-spacing rounded-md bg-primary-foreground w-full">
        <h1 className="font-bold text-&xl mb-8">
          Configuration des lames de parquet
        </h1>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-end">
            <label htmlFor="room-width" className="mr-2 text-right w-72">Largeur des lames de parquet :</label>
            <Input id="strips-width" type="number" className="w-24" value={stripWidth} onChange={e => setStripWidth(Number(e.currentTarget.value))} />
          </div>
        </div>
      </div>

      <h2 className="font-bold text-1xl mt-8 mb-4">
        Ajouter les lames de parquet
      </h2>

      <div className="flex gap-4 p-4 border border-spacing-4 border-zinc-200 rounded-md bg-primary-foreground">
        <div className="flex items-center gap-4">
          <label htmlFor="strips-length" className="w-auto whitespace-nowrap">
            Longueur de la lame à ajouter
          </label>
          <Input
            id="strips-length"
            className="w-24"
            ref={inputLengthRef}
            type="number"
            onKeyDown={onKeyDown}
          />
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="strips-count" className="w-auto whitespace-nowrap">
            Nombre
          </label>
          <Input
            id="strips-count"
            className="w-24"
            type="number"
            ref={inputCountRef}
          />
        </div>
        <div className="">
          <Button
            size="icon"
            className="bg-lime-600 hover:bg-lime-700 h-9 w-9"
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
            <SquarePlus />
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <ScrollArea className="h-72 w-auto rounded-md border mt-4 bg-primary-foreground">
          {Object.entries(groupedStripLength)
            .sort(
              (entriesA, entriesB) => Number(entriesA[0]) - Number(entriesB[0]),
            )
            .map((groupedStripLengthItem) => (
              <div key={groupedStripLengthItem[0]} className="flex m-2">
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-1 mr-0"
                  onClick={() => {
                    removeStrip(Number(groupedStripLengthItem[0]));
                  }}
                >
                  <SquareMinus size={12} />
                </Button>
                <Button
                  variant="ghost"
                  className="h-6 w-6 p-1 mr-0"
                  onClick={() => {
                    addStrip(Number(groupedStripLengthItem[0]));
                  }}
                >
                  <SquarePlus size={12} />
                </Button>
                <div className="ml-4">
                  {groupedStripLengthItem[1]} X {groupedStripLengthItem[0]} {unit}
                </div>
              </div>
            ))}
        </ScrollArea>
        <div className="flex flex-col rounded-md border mt-4 p-4">
          <p>Nombre de lames : {stripLengths.length}</p>
          <p>Longueur total : {totalLength.toString()}</p>
          <p className={cn(stripsArea < roomArea ? 'text-red-700 font-bold' : 'text-green-700')}>Superficie du parquet : {stripsArea} {unit}²</p>
          <p className="mt-2">Superficie de la pièce : {roomArea} {unit}²</p>
        </div>
      </div>

      <Button asChild className="m-4" disabled={stripsArea < roomArea}>
        <Link title="Calculer" href="/parquet-layout">
          Calculer
        </Link>
      </Button>

    </main>
  );
}
