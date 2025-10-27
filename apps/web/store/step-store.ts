import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface StepState {
  step: number
  next: () => void
}

const useStepStore = create<StepState>()(
  devtools(
    persist(
      (set) => ({
        step: 0,
        next: () => {
          set((state) => ({ step: state.step + 1 }))
        },
      }),
      { name: "stepStore" }
    )
  )
)

export { useStepStore }
