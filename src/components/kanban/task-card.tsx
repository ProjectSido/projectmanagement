"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar, Trash2, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/lib/supabase/types";
import { useKanbanStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

const priorityColors: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    urgent: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const priorityGlow: Record<string, string> = {
    low: "hover:shadow-emerald-500/10",
    medium: "hover:shadow-amber-500/10",
    high: "hover:shadow-orange-500/10",
    urgent: "hover:shadow-rose-500/20",
};

export default function TaskCard({ task, onEdit }: TaskCardProps) {
    const { deleteTask } = useKanbanStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "task",
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const formatDate = (date: string | null) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
        });
    };

    const isOverdue = task.due_date && new Date(task.due_date) < new Date();

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-card/80 backdrop-blur-sm border border-border/50 transition-all duration-300",
                "hover:border-primary/30 hover:shadow-lg",
                priorityGlow[task.priority],
                isDragging && "opacity-50 rotate-2 scale-105 shadow-2xl z-50"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute top-2 left-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            <CardContent className="p-4 pl-7">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2">
                            {task.title}
                        </h4>

                        {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-1.5">
                            <Badge
                                variant="outline"
                                className={cn("text-[10px] px-1.5 py-0", priorityColors[task.priority])}
                            >
                                {task.priority}
                            </Badge>

                            {task.labels?.map((label, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-[10px] px-1.5 py-0"
                                >
                                    {label}
                                </Badge>
                            ))}
                        </div>

                        {task.due_date && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-[11px]",
                                    isOverdue ? "text-rose-500" : "text-muted-foreground"
                                )}
                            >
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(task.due_date)}</span>
                            </div>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="sr-only">Actions</span>
                                <Edit3 className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem onClick={() => onEdit(task)}>
                                <Edit3 className="mr-2 h-3 w-3" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-rose-500 focus:text-rose-500"
                                onClick={() => deleteTask(task.id)}
                            >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>

            {/* Priority indicator line */}
            <div
                className={cn(
                    "absolute left-0 top-3 bottom-3 w-0.5 rounded-full",
                    task.priority === "urgent" && "bg-rose-500",
                    task.priority === "high" && "bg-orange-500",
                    task.priority === "medium" && "bg-amber-500",
                    task.priority === "low" && "bg-emerald-500"
                )}
            />
        </Card>
    );
}
