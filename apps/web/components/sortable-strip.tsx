import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { HTMLAttributes, JSX } from "react"
import type { Strip as IStrip } from "../lib/calculator"
import Strip from "./strip"

type SortableStripProps = {
  strip: IStrip
} & HTMLAttributes<HTMLDivElement>

function SortableStrip({ strip, ...props }: SortableStripProps): JSX.Element {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: strip.id,
    disabled: strip.isCut,
  })

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
  }

  return (
    <Strip
      strip={strip}
      ref={setNodeRef}
      style={styles}
      isOpacityEnabled={isDragging}
      {...props}
      {...attributes}
      {...listeners}
    />
  )
}

export default SortableStrip
