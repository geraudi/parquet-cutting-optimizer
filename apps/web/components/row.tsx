"use client";

import { type HTMLAttributes, type JSX, useId, useState } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Menu } from "lucide-react";
import { type Row as IRow, type Strip as IStrip } from "@web/lib/calculator";
import Strip from "@web/components/strip";
import SortableStrip from "@web/components/sortable-strip";

type RowProps = {
  row: IRow;
} & HTMLAttributes<HTMLDivElement>;

export default function Row({ row }: RowProps): JSX.Element {
  const id = useId();
  const [strips, setStrips] = useState<IStrip[]>(row.strips);
  const [activeStrip, setActiveStrip] = useState<IStrip>();

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: row.id,
  });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    opacity: isDragging ? "0.5" : "1",
    cursor: isDragging ? "grabbing" : "grab",
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // triggered when dragging strip starts
  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    setActiveStrip(strips.find((strip) => strip.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over) return;

    const draggedStrip = strips.find((strip) => strip.id === active.id);
    const overItem = strips.find((strip) => strip.id === over.id);

    if (!draggedStrip || !overItem) {
      return;
    }

    const activeIndex = strips.findIndex((strip) => strip.id === active.id);
    const overIndex = strips.findIndex((strip) => strip.id === over.id);

    if (activeIndex !== overIndex) {
      setStrips((prev) => arrayMove<IStrip>(prev, activeIndex, overIndex));
    }
  };

  const handleDragCancel = (): void => {
    setActiveStrip(undefined);
  };

  return (
    <div style={styles} ref={setNodeRef} className="flex items-center">
      <div
        className="w-8 print:hidden"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
      >
        <button type="button">
          <Menu />
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        id={id}
      >
        <div className="flex items-center">
          <SortableContext items={strips}>
            {strips.map((strip) => (
              <SortableStrip strip={strip} key={strip.id} />
            ))}
          </SortableContext>
          <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
            {activeStrip ? <Strip strip={activeStrip} isDragging /> : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
}
