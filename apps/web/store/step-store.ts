import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { StateCreator } from "zustand";

interface StepState {
  step: number;
  next: () => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Complex middleware type inference makes explicit return type unwieldy
const myMiddlewares = (f: StateCreator<StepState>) =>
  devtools(persist(f, { name: "stepStore" }));

const useStepStore = create<StepState>()(
  myMiddlewares((set) => ({
    step: 0,
    next: () => {
      set((state) => ({ step: state.step++ }));
    },
  })),
);

export { useStepStore };
