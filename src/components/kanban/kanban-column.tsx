"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, Trash2, Edit3, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column, Task } from "@/lib/supabase/types";
import { useKanbanStore } from "@/lib/store";
import TaskCard from "./task-card";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
    column: Column;
    tasks: Task[];
    onAddTask: (columnId: string) => void;
    onEditTask: (task: Task) => void;
}

const columnColors = [
    "#94a3b8", // slate
    "#f87171", // red
    "#fb923c", // orange
    "#fbbf24", // amber
    "#a3e635", // lime
    "#22c55e", // green
    "#14b8a6", // teal
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#f43f5e", // rose
];

export default function KanbanColumn({
    column,
    tasks,
    onAddTask,
    onEditTask,
}: KanbanColumnProps) {
    const { updateColumn, deleteColumn } = useKanbanStore();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);

    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: "column",
            column,
        },
    });

    const handleTitleSubmit = () => {
        if (title.trim() && title !== column.title) {
            updateColumn(column.id, { title: title.trim() });
        } else {
            setTitle(column.title);
        }
        setIsEditing(false);
    };

    const handleColorChange = (color: string) => {
        updateColumn(column.id, { color });
    };

    return (
        <div
            className={cn(
                "flex flex-col w-80 shrink-0 rounded-xl transition-all duration-300",
                "bg-gradient-to-b from-muted/50 to-muted/30 backdrop-blur-sm",
                "border border-border/50 hover:border-border",
                isOver && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
            )}
        >
            {/* Column Header */}
            <div className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div
                            className="w-3 h-3 rounded-full shrink-0 ring-2 ring-offset-2 ring-offset-background"
                            style={{
                                backgroundColor: column.color,
                                boxShadow: `0 0 12px ${column.color}40`,
                            }}
                        />

                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleTitleSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleTitleSubmit();
                                    if (e.key === "Escape") {
                                        setTitle(column.title);
                                        setIsEditing(false);
                                    }
                                }}
                                className="h-7 text-sm font-semibold bg-transparent border-none px-0 focus-visible:ring-0"
                                autoFocus
                            />
                        ) : (
                            <h3
                                className="font-semibold text-sm cursor-pointer hover:text-primary transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                {column.title}
                            </h3>
                        )}

                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {tasks.length}
                        </span>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                <Edit3 className="mr-2 h-3 w-3" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <DropdownMenuItem>
                                        <Palette className="mr-2 h-3 w-3" />
                                        Color
                                    </DropdownMenuItem>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" className="p-2">
                                    <div className="grid grid-cols-4 gap-2">
                                        {columnColors.map((color) => (
                                            <button
                                                key={color}
                                                className={cn(
                                                    "w-6 h-6 rounded-full ring-offset-2 ring-offset-background transition-all",
                                                    column.color === color && "ring-2 ring-primary"
                                                )}
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleColorChange(color)}
                                            />
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuItem
                                className="text-rose-500 focus:text-rose-500"
                                onClick={() => deleteColumn(column.id)}
                            >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Tasks List */}
            <ScrollArea className="flex-1 px-3">
                <div
                    ref={setNodeRef}
                    className={cn(
                        "flex flex-col gap-2 min-h-[200px] pb-3 transition-colors",
                        isOver && "bg-primary/5 rounded-lg"
                    )}
                >
                    <SortableContext
                        items={tasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={onEditTask}
                            />
                        ))}
                    </SortableContext>

                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                                <Plus className="h-5 w-5" />
                            </div>
                            <p className="text-xs">No tasks yet</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Add Task Button */}
            <div className="p-3 pt-0">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 h-9 text-muted-foreground hover:text-foreground"
                    onClick={() => onAddTask(column.id)}
                >
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>
        </div>
    );
}
