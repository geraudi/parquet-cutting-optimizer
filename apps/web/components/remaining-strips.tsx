import { type JSX } from "react";
import {
  type RoomSize as IRoomSize,
  type Strip as IStrip,
} from "../lib/calculator";
import { stripsInput } from "../strips-input";
import Strip from "./strip";

interface RemainingStripsProps {
  strips: IStrip[];
  roomSizes: IRoomSize[];
}

export default function RemainingStrips({
  strips,
  roomSizes,
}: RemainingStripsProps): JSX.Element {
  const stripeCount = stripsInput.length;
  const area =
    (stripsInput.reduce((acc, strip) => acc + strip, 0) * 13) / 10000;

  let roomsArea = 0;
  roomSizes.forEach((roomSize) => {
    roomsArea += roomSize.x * roomSize.y;
  });

  return (
    <>
      <div className="text-gray-800 text-xl font-bold mt-8 mb-3">
        Lames restantes
      </div>
      <div>Nombre de lames de parquet : {stripeCount}</div>
      <div>Superficie du parquet : {area} m2</div>
      <div>Superficie des pièces : {roomsArea / 10000} m2</div>

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
