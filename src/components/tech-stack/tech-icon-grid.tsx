"use client";

import React from "react";
import type { TechItem } from "@/types/tech";
import { TECH_STACK } from "@/data/tech-stack-data";
import { IconImage } from "@/components/ui/components/IconImage";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type PerLine = 5 | 6 | 7 | 8 | 9 | 10;

interface TechIconGridProps {
  iconIds: string[];
  size?: number;
  perLine?: PerLine;
  selectedTech?: TechItem[];
  setSelectedTech?: (tech: TechItem[]) => void;
}

function SortableIcon({ iconId, size }: { iconId: string; size: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: iconId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const tech = TECH_STACK[iconId as keyof typeof TECH_STACK];
  const iconifyIcon = tech?.iconify || `logos:${iconId}`;
  const iconUrl = `https://api.iconify.design/${iconifyIcon}.svg?width=${size}&height=${size}`;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IconImage src={iconUrl} alt={tech?.name || iconId} size={size} />
    </div>
  );
}

const TechIconGrid = React.memo(function TechIconGrid({
  iconIds,
  size = 48,
  perLine = 10,
  selectedTech,
  setSelectedTech,
}: TechIconGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && selectedTech && setSelectedTech) {
      const oldIndex = selectedTech.findIndex((tech) => tech.id === active.id);
      const newIndex = selectedTech.findIndex((tech) => tech.id === over.id);

      setSelectedTech(arrayMove(selectedTech, oldIndex, newIndex));
    }
  };

  if (iconIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-16 py-3 text-muted-foreground gap-2">
        <div className="w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-muted-foreground/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground/70">No technologies selected</p>
          <p className="text-xs text-muted-foreground">
            Select items below to preview them here
          </p>
        </div>
      </div>
    );
  }

  // If drag & drop is enabled (selectedTech and setSelectedTech are provided)
  if (selectedTech && setSelectedTech) {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={iconIds} strategy={rectSortingStrategy}>
          <div
            className="flex flex-wrap gap-2 justify-center"
            style={{
              maxWidth: `${perLine * (size + 8)}px`,
            }}
          >
            {iconIds.map((iconId) => (
              <SortableIcon key={iconId} iconId={iconId} size={size} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  // Fallback: non-draggable version
  return (
    <div
      className="flex flex-wrap gap-2 justify-center"
      style={{
        maxWidth: `${perLine * (size + 8)}px`,
      }}
    >
      {iconIds.map((iconId) => {
        const tech = TECH_STACK[iconId as keyof typeof TECH_STACK];
        const iconifyIcon = tech?.iconify || `logos:${iconId}`;
        const iconUrl = `https://api.iconify.design/${iconifyIcon}.svg?width=${size}&height=${size}`;
        return (
          <IconImage
            key={iconId}
            src={iconUrl}
            alt={tech?.name || iconId}
            size={size}
          />
        );
      })}
    </div>
  );
});

export default TechIconGrid;
