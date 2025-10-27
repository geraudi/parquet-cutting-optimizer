import { v4 as uuidV4 } from "uuid"

export type StripsInput = Record<number, number>

export interface Strip {
  width: number
  originalWidth: number
  rest: number | null
  isCut: boolean
  id: string
}

export interface Row {
  id: string
  strips: Strip[]
}

export interface Room {
  id: string
  rows: Row[]
}

export interface RoomSize {
  width: number
  height: number
}

const STRIPE_HEIGHT = 13
const CUT_SIZE = 0.0 // 1mm

function add(a: number, b: number): number {
  return Math.round(a * 1000 + b * 1000) / 1000
}

function sub(a: number, b: number): number {
  return Math.round(a * 1000 - b * 1000) / 1000
}

function getRandomStrip(
  min: number,
  max: number,
  strips: Strip[],
  isFirst: boolean
): Strip {
  // cut strip can only be used at the beginning of the line
  // Use the cutStrip to start new row
  const cutStrips = strips.filter((strip) => strip.isCut)
  if (cutStrips.length > 0 && isFirst) {
    // `!` is Non-null assertion operator syntax
    return cutStrips[0]!
  }

  const validStrips = strips.filter((strip) => {
    if (strip.isCut && !isFirst) {
      return false
    }
    return strip.width >= min && strip.width <= max
  })

  if (validStrips.length === 0) {
    throw new Error("No valid strips found")
  }

  return validStrips[Math.floor(Math.random() * validStrips.length)]!
}

function isValidStrip(nextFreeSpace: number): boolean {
  // Penultimate stripe must leave at least 30
  if (nextFreeSpace < 30 && nextFreeSpace > 0) {
    return false
  }

  // Last stripe will be cut. The cut part must be over 30
  return !(nextFreeSpace < 0 && nextFreeSpace > -30)
}

function getRoomStripes(
  roomSizes: RoomSize[],
  strips: Strip[]
): { rooms: Room[]; restStrips: Strip[] } {
  // Deep clone the strips
  let clonedStrips: Strip[] = JSON.parse(JSON.stringify(strips)) as Strip[]
  const rooms: Room[] = []

  // Rooms
  roomSizes.forEach((roomSize) => {
    const rowCount = Math.ceil(roomSize.height / STRIPE_HEIGHT)
    const room: Room = {
      id: uuidV4(),
      rows: [],
    }

    // Rows
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let retryCount = 0

      const row: Row = {
        id: uuidV4(),
        strips: [],
      }
      let freeSpace = roomSize.width
      let isFirst = true

      // Strips in row
      while (freeSpace > 0) {
        retryCount += 1
        if (retryCount > 1000) {
          throw new Error("Too many retries")
        }
        const strip = getRandomStrip(30, roomSize.width, clonedStrips, isFirst)
        const nextFreeSpace = sub(freeSpace, strip.width)

        if (isValidStrip(nextFreeSpace)) {
          freeSpace = nextFreeSpace
          isFirst = false

          // The last strip in row
          if (nextFreeSpace < 0) {
            // Cut current strip to fulfill the row
            strip.width = add(strip.width, nextFreeSpace)
            strip.rest = -nextFreeSpace
            strip.isCut = true
            // Add childStrip ?

            // Add new strip with the rest of the current strip
            clonedStrips.push({
              width: sub(-nextFreeSpace, CUT_SIZE),
              isCut: true,
              originalWidth: strip.width,
              rest: null,
              id: uuidV4(),
              // parentStrip: strip
            })
          }
          row.strips.push(strip)

          // remove strip
          clonedStrips = clonedStrips.filter((s) => s.id !== strip.id)
        }
      }
      room.rows.push(row)
    }

    rooms.push({
      id: uuidV4(),
      rows: room.rows,
    })
  })

  return {
    rooms,
    restStrips: clonedStrips,
  }
}

function buildStrips(stripsInput: number[]): Strip[] {
  return stripsInput
    .map((stripWidth: number) => {
      return {
        width: stripWidth,
        originalWidth: stripWidth,
        rest: null,
        isCut: false,
        id: uuidV4(),
      }
    })
    .sort((a, b) => a.width - b.width)
}

export function calculate(
  roomSizes: RoomSize[],
  stripsInput: number[]
): { rooms: Room[]; restStrips: Strip[] } {
  const maxRetry = 20
  const strips = buildStrips(stripsInput)

  for (let retryCount = 0; retryCount < maxRetry; retryCount++) {
    try {
      return getRoomStripes(roomSizes, strips)
    } catch (_e) {
      // retry get rooms
    }
  }

  throw new Error("Cannot calculate stripsInput.")
}
