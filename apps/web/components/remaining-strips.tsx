import { useStripStore } from "@web/store/strip-store"
import Big from "big.js"
import type { JSX } from "react"
import type { RoomSize as IRoomSize, Strip as IStrip } from "../lib/calculator"
import Strip from "./strip"

interface RemainingStripsProps {
  strips: IStrip[]
  roomSizes: IRoomSize[]
}

export default function RemainingStrips({
  strips,
  roomSizes,
}: RemainingStripsProps): JSX.Element {
  const stripLengths = useStripStore((state) => state.stripLengths)
  const _stripeCount = stripLengths.length
  const totalLength = stripLengths.reduce(
    (sum, length) => Big(sum).plus(length).toNumber(),
    0
  )
  const _area = Big(totalLength).mul(13).div(10000).toNumber()

  const _roomsArea = roomSizes.reduce((acc, roomSize) => {
    return Big(acc).plus(Big(roomSize.width).mul(roomSize.height)).toNumber()
  }, 0)

  return (
    <>
      <div>
        Longueur restante :{" "}
        {Math.round(
          strips.reduce((acc, strip) => acc + Number(strip.width), 0) * 1000
        ) / 1000}{" "}
        cm
      </div>

      {strips.map((strip) => (
        <Strip strip={strip} key={strip.id} />
      ))}
    </>
  )
}
