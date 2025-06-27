import { type JSX } from "react";
import {
  type RoomSize as IRoomSize,
  type Strip as IStrip,
} from "../lib/calculator";
import { useStripStore } from "@web/store/strip-store";
import Strip from "./strip";
import Big from "big.js";

interface RemainingStripsProps {
  strips: IStrip[];
  roomSizes: IRoomSize[];
}

export default function RemainingStrips({
  strips,
  roomSizes,
}: RemainingStripsProps): JSX.Element {
  const stripLengths = useStripStore(state => state.stripLengths);
  const stripeCount = stripLengths.length;
  const totalLength = stripLengths.reduce((sum, length) => Big(sum).plus(length).toNumber(), 0);
  const area = Big(totalLength).mul(13).div(10000).toNumber();

  const roomsArea = roomSizes.reduce((acc, roomSize) => {
    return Big(acc).plus(Big(roomSize.width).mul(roomSize.height)).toNumber();
  }, 0);

  return (
    <>
      <div>
        Longueur restante :{" "}
        {Math.round(
          strips.reduce((acc, strip) => acc + Number(strip.width), 0) * 1000,
        ) / 1000}{" "}
        cm
      </div>

      {strips.map((strip) => (
        <Strip strip={strip} key={strip.id} />
      ))}
    </>
  );
}
