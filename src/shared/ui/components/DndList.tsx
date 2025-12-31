"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/shared/ui/button";
import { X, GripVertical } from "lucide-react";

export interface SortableItemProps<T> {
  item: T;
  id: string;
  onDelete: (id: string) => void;
  renderItem: (item: T) => React.ReactNode;
}

export function SortableItem<T>({
  item,
  id,
  onDelete,
  renderItem,
}: SortableItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between bg-secondary rounded mb-2"
    >
      <div {...listeners} className="flex items-center  cursor-move p-2 w-34">
        <span className="mr-2">
          <GripVertical size={16} />
        </span>
        {renderItem(item)}
      </div>
      <Button variant="ghost" size="sm" onClick={handleDelete} className="ml-2">
        <X size={16} onClick={handleDelete} />
      </Button>
    </li>
  );
}

interface DndListProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  getItemId: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
}

export function DndList<T>({
  items,
  setItems,
  getItemId,
  renderItem,
}: DndListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setItems((prevItems: T[]) => {
        const oldIndex = prevItems.findIndex(
          (item) => getItemId(item) === active.id
        );
        const newIndex = prevItems.findIndex(
          (item) => getItemId(item) === over.id
        );

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => getItemId(item) !== id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={verticalListSortingStrategy}
      >
        <ul>
          {items.map((item) => (
            <SortableItem
              key={getItemId(item)}
              item={item}
              id={getItemId(item)}
              onDelete={handleDelete}
              renderItem={renderItem}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
