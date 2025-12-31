import { type CSSProperties, forwardRef, type HTMLAttributes } from "react";
import type { Strip } from "../lib/calculator";

type StripProps = {
  strip: Strip;
  isOpacityEnabled?: boolean;
  isDragging?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const StripComponent = forwardRef<HTMLDivElement, StripProps>(
  (
    { strip, isOpacityEnabled, isDragging, style, ...props }: StripProps,
    ref
  ) => {
    const ratio = 3;
    const baseStyles: CSSProperties = {
      opacity: isOpacityEnabled ? "0.5" : "1",
      cursor: isDragging ? "grabbing" : "grab",
      transform: isDragging ? "scale(1.05) translateY(-4px)" : "scale(1)",
      fontSize: 10,
      boxSizing: "border-box",
      width: strip.width * ratio,
      height: 13 * ratio,
      lineHeight: `${(13 * ratio).toString()}px`,
      textAlign: "center",
      position: "relative",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      fontFamily: "ui-monospace, monospace",
      fontWeight: 600,
      ...style,
    };

    // Gradient wood-like colors
    const woodColors = strip.isCut
      ? {
          primary: "#9ca3af",
          secondary: "#6b7280",
          border: "#4b5563",
          text: "#374151",
        }
      : {
          primary: "#d4a574",
          secondary: "#c8935a",
          border: "#a67c52",
          text: "#5a3e2b",
        };

    const stripStyles: CSSProperties = {
      ...baseStyles,
      background: `linear-gradient(180deg, ${woodColors.primary} 0%, ${woodColors.secondary} 100%)`,
      border: `1px solid ${woodColors.border}`,
      borderRadius: "2px",
      boxShadow: isDragging
        ? "0 10px 25px rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15)"
        : "0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      color: woodColors.text,
    };

    // Add wood grain texture overlay
    const grainOverlay: CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.03) 2px,
        rgba(0, 0, 0, 0.03) 4px
      )`,
      pointerEvents: "none",
      borderRadius: "2px",
    };

    const highlightOverlay: CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "40%",
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)",
      pointerEvents: "none",
      borderRadius: "2px 2px 0 0",
    };

    return (
      <div style={stripStyles} {...props} ref={!strip.isCut ? ref : undefined}>
        <div style={grainOverlay} />
        <div style={highlightOverlay} />
        <span
          style={{
            position: "relative",
            zIndex: 1,
            textShadow: "0 1px 2px rgba(255, 255, 255, 0.3)",
          }}
        >
          {strip.width}{" "}
          {strip.originalWidth !== strip.width && strip.rest
            ? `(${strip.originalWidth.toString()} / ${strip.rest.toString()})`
            : ""}
        </span>
      </div>
    );
  }
);

StripComponent.displayName = "Strip";

export default StripComponent;
