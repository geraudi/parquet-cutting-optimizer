import { RoomSize } from "@web/lib/calculator";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'

interface StripState {
  roomSize: RoomSize;
  stripWidth: number;
  stripLengths: number[];
  totalLength: number;
  add: (length: number, count?: number) => void;
  remove: (length: number) => void;
  setRoomWidth: (width: number) => void;
  setRoomHeight: (height: number) => void;
  setStripWidth: (stripWidth: number) => void;
  removeAll: (length: number) => void;
}

const useStripStore = create<StripState>()(
  persist(
    immer(
      (set) => ({
        roomSize: {
          width: 0,
          height: 0
        },
        stripWidth: 0,
        stripLengths: [],
        totalLength: 0,
        setRoomWidth: (width: number) => {
          set((state) => {
            state.roomSize.width = width;
            return state;
          });
        },
        setRoomHeight: (height: number) => {
          set((state) => {
            state.roomSize.height = height;
            return state;
          });
        },
        setStripWidth: (stripWidth: number) => {
          set((state) => {
            state.stripWidth = stripWidth;
            return state;
          });
        },
        add: (length, count = 1) => {
          set((state) => {
            const lengths = Array<number>(count).fill(length);
            return { stripLengths: [...state.stripLengths, ...lengths] };
          });
        },
        remove: (length) => {
          set((state) => {
            const index = state.stripLengths.indexOf(length);
            if (index > -1) {
              const clonedLenghts = [...state.stripLengths];
              clonedLenghts.splice(index, 1);

              return { stripLengths: clonedLenghts };
            }

            return state;
          });
        },
        removeAll: (length) => {
          set((state) => {
            return { stripLengths: state.stripLengths.filter(l => l !== length) };
          });
        },
      })),
    { name: "strip-store" }
  )
)


export { useStripStore };
