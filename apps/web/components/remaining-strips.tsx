import { useStripStore } from "@web/store/strip-store";
import Big from "big.js";
import type { JSX } from "react";
import type { RoomSize as IRoomSize, Strip as IStrip } from "../lib/calculator";
import Strip from "./strip";

interface RemainingStripsProps {
  strips: IStrip[];
  roomSizes: IRoomSize[];
}

export default function RemainingStrips({
  strips,
  roomSizes,
}: RemainingStripsProps): JSX.Element {
  const stripLengths = useStripStore((state) => state.stripLengths);
  const _stripeCount = stripLengths.length;
  const totalLength = stripLengths.reduce(
    (sum, length) => Big(sum).plus(length).toNumber(),
    0
  );
  const _area = Big(totalLength).mul(13).div(10000).toNumber();

  const _roomsArea = roomSizes.reduce((acc, roomSize) => {
    return Big(acc).plus(Big(roomSize.width).mul(roomSize.height)).toNumber();
  }, 0);

  const totalRemaining =
    Math.round(
      strips.reduce((acc, strip) => acc + Number(strip.width), 0) * 1000
    ) / 1000;

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg bg-green-100 border border-green-200/50">
        <div className="text-xs text-amber-700 font-medium mb-1">
          Longueur totale restante
        </div>
        <div className="text-2xl font-bold font-mono text-amber-900">
          {totalRemaining} <span className="text-sm text-amber-600">cm</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {strips.map((strip) => (
          <div
            key={strip.id}
            className="hover:scale-[1.02] transition-transform"
          >
            <Strip strip={strip} />
          </div>
        ))}
      </div>
    </div>
  );
}
