import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface LinkType {
  id: number;
  title: string;
  url: string;
  created_at: string;
  click_count: number;
  favicon_url: string | null;
  order: number;
  is_visible: boolean;
}

interface SortableLinkListProps {
  links: LinkType[];
  onReorder: (activeId: number, overId: number) => void;
  onDelete: (linkId: number) => void;
  onToggleVisibility: (linkId: number, isVisible: boolean) => void;
}

interface SortableItemProps {
  link: LinkType;
  onDelete: (linkId: number) => void;
  onToggleVisibility: (linkId: number, isVisible: boolean) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ link, onDelete, onToggleVisibility }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 flex items-center justify-between cursor-grab",
        isDragging ? "ring-2 ring-primary" : ""
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-0 flex items-center gap-3 flex-grow">
        {link.favicon_url && (
          <img src={link.favicon_url} alt="Favicon" className="w-5 h-5 rounded-full" />
        )}
        <div>
          <p className="font-semibold">{link.title}</p>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
            {link.url}
          </a>
        </div>
      </CardContent>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>{link.click_count}</span>
        </div>
        <Switch
          checked={link.is_visible}
          onCheckedChange={(checked) => onToggleVisibility(link.id, checked)}
          aria-label="Link görünürlüğünü değiştir"
        />
        <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
};

const SortableLinkList: React.FC<SortableLinkListProps> = ({ links, onReorder, onDelete, onToggleVisibility }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onReorder(active.id as number, over?.id as number);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map(link => link.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {links.map((link) => (
            <SortableItem
              key={link.id}
              link={link}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableLinkList;