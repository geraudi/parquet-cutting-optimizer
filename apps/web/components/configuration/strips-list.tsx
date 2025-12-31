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
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { SquareMinus, SquarePlus, Trash2 } from "lucide-react";

type GroupedStrips = Record<number, number>;
const unit = "cm";

export function StripsList() {
  const stripLengths = useStripStore((state) => state.stripLengths);
  const addStrip = useStripStore((state) => state.add);
  const removeStrip = useStripStore((state) => state.remove);
  const removeAllStrips = useStripStore((state) => state.removeAll);

  const groupedStripLength = stripLengths.reduce<GroupedStrips>(
    (acc: GroupedStrips, stripLength: number) => {
      acc[stripLength] = (acc[stripLength] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lames ajoutées</CardTitle>
        <CardDescription>
          {stripLengths.length > 0
            ? `${stripLengths.length} lames au total`
            : "Aucune lame ajoutée"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stripLengths.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Ajoutez des lames ci-dessous pour commencer
          </p>
        ) : (
          <ScrollArea className="h-72">
            <div className="space-y-2">
              {Object.entries(groupedStripLength)
                .sort(
                  (entriesA, entriesB) =>
                    Number(entriesA[0]) - Number(entriesB[0])
                )
                .map((groupedStripLengthItem) => (
                  <div
                    key={groupedStripLengthItem[0]}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        removeStrip(Number(groupedStripLengthItem[0]))
                      }
                    >
                      <SquareMinus size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        addStrip(Number(groupedStripLengthItem[0]))
                      }
                    >
                      <SquarePlus size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        removeAllStrips(Number(groupedStripLengthItem[0]))
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                    <span className="flex-1">
                      {groupedStripLengthItem[1]} × {groupedStripLengthItem[0]}{" "}
                      {unit}
                    </span>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
