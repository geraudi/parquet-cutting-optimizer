"use client";

import { type JSX, useId, useState } from "react";
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
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { type Room as IRoom, type Row as IRow } from "@web/lib/calculator";
import Row from "@web/components/row";

interface RoomProps {
  room: IRoom;
  onRowsChange?: (rows: IRow[]) => void;
}

export default function Room({ room, onRowsChange }: RoomProps): JSX.Element {
  const id = useId();
  const [rows, setRows] = useState<IRow[]>(room.rows);
  const [activeRow, setActiveRow] = useState<IRow>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // triggered when dragging row starts
  const handleDragStart = (event: DragStartEvent): void => {
    const { active } = event;
    setActiveRow(rows.find((row) => row.id === active.id));
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over) return;

    const draggedRow = rows.find((row) => row.id === active.id);
    const overItem = rows.find((row) => row.id === over.id);

    if (!draggedRow || !overItem) {
      return;
    }

    const activeIndex = rows.findIndex((row) => row.id === active.id);
    const overIndex = rows.findIndex((row) => row.id === over.id);

    if (activeIndex !== overIndex) {
      const newRows = arrayMove<IRow>(rows, activeIndex, overIndex);
      setRows(newRows);
      if (onRowsChange) onRowsChange(newRows);
    }
  };

  const handleDragCancel = (): void => {
    setActiveRow(undefined);
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          id={id}
        >
          <SortableContext items={rows}>
            {rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </SortableContext>
          <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
            {activeRow ? <Row row={activeRow} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
