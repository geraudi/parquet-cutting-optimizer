import { type CSSProperties, forwardRef, type HTMLAttributes } from "react"
import type { Strip } from "../lib/calculator"

type StripProps = {
  strip: Strip
  isOpacityEnabled?: boolean
  isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>

const StripComponent = forwardRef<HTMLDivElement, StripProps>(
  (
    { strip, isOpacityEnabled, isDragging, style, ...props }: StripProps,
    ref
  ) => {
    const ratio = 3
    const styles: CSSProperties = {
      opacity: isOpacityEnabled ? "0.5" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      transform: isDragging ? "scale(1.05)" : "scale(1)",
      fontSize: 10,
      boxSizing: "border-box",
      width: strip.width * ratio,
      height: 13 * ratio,
      lineHeight: `${(13 * ratio).toString()}px`,
      textAlign: "center",
      border: "1px solid #444",
      backgroundColor: strip.isCut ? "#AAAAAA" : "#CCCCCC",
      ...style,
    }

    return (
      <div style={styles} {...props} ref={!strip.isCut ? ref : undefined}>
        {strip.width}{" "}
        {strip.originalWidth !== strip.width && strip.rest
          ? `(${strip.originalWidth.toString()} / ${strip.rest.toString()})`
          : ""}
      </div>
    )
  }
)

StripComponent.displayName = "Strip"

export default StripComponent
