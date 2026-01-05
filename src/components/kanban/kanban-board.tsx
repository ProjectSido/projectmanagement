"use client";

import React, { useState, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKanbanStore } from "@/lib/store";
import { Task } from "@/lib/supabase/types";
import KanbanColumn from "./kanban-column";
import TaskCard from "./task-card";
import TaskDialog from "./task-dialog";
import { cn } from "@/lib/utils";

export default function KanbanBoard() {
    const {
        currentBoard,
        columns,
        tasks,
        isLoading,
        fetchColumns,
        createColumn,
        reorderColumns,
        moveTask,
    } = useKanbanStore();

    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    useEffect(() => {
        if (currentBoard) {
            fetchColumns(currentBoard.id);
        }
    }, [currentBoard, fetchColumns]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        // Check if we're over a column
        const overColumn = columns.find((c) => c.id === overId);
        if (overColumn) {
            // Moving to an empty column or hovering over column header
            if (activeTask.column_id !== overColumn.id) {
                moveTask(activeTask.id, overColumn.id, 0);
            }
            return;
        }

        // Check if we're over another task
        const overTask = tasks.find((t) => t.id === overId);
        if (overTask && activeTask.column_id !== overTask.column_id) {
            const tasksInColumn = tasks
                .filter((t) => t.column_id === overTask.column_id)
                .sort((a, b) => a.position - b.position);

            const overIndex = tasksInColumn.findIndex((t) => t.id === overId);
            moveTask(activeTask.id, overTask.column_id, overIndex);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const activeTask = tasks.find((t) => t.id === activeId);
        const overTask = tasks.find((t) => t.id === overId);

        if (!activeTask) return;

        // If dropped on another task in the same column, reorder
        if (overTask && activeTask.column_id === overTask.column_id) {
            const tasksInColumn = tasks
                .filter((t) => t.column_id === activeTask.column_id)
                .sort((a, b) => a.position - b.position);

            const oldIndex = tasksInColumn.findIndex((t) => t.id === activeId);
            const newIndex = tasksInColumn.findIndex((t) => t.id === overId);

            if (oldIndex !== newIndex) {
                const newOrder = arrayMove(tasksInColumn, oldIndex, newIndex);
                // Update positions
                newOrder.forEach((task, index) => {
                    if (task.position !== index) {
                        useKanbanStore.getState().updateTask(task.id, { position: index });
                    }
                });
            }
        }
    };

    const handleAddTask = (columnId: string) => {
        setSelectedColumnId(columnId);
        setEditingTask(null);
        setTaskDialogOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setSelectedColumnId(task.column_id);
        setTaskDialogOpen(true);
    };

    const handleAddColumn = () => {
        if (!newColumnTitle.trim() || !currentBoard) return;

        createColumn({
            title: newColumnTitle.trim(),
            board_id: currentBoard.id,
            position: columns.length,
            color: "#6366f1",
        });

        setNewColumnTitle("");
        setIsAddingColumn(false);
    };

    if (!currentBoard) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📋</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Select a Board</h2>
                    <p className="text-sm text-muted-foreground">
                        Choose a board from the sidebar or create a new one
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Board Header */}
            <div className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-background to-muted/30">
                <div className="flex items-center gap-3">
                    <div
                        className="w-4 h-4 rounded-md"
                        style={{ backgroundColor: currentBoard.color }}
                    />
                    <h1 className="text-xl font-bold">{currentBoard.name}</h1>
                    <span className="text-sm text-muted-foreground">
                        {columns.length} columns · {tasks.length} tasks
                    </span>
                </div>
                {currentBoard.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {currentBoard.description}
                    </p>
                )}
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 overflow-x-auto p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-5 h-full">
                        {columns
                            .sort((a, b) => a.position - b.position)
                            .map((column) => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    tasks={tasks
                                        .filter((t) => t.column_id === column.id)
                                        .sort((a, b) => a.position - b.position)}
                                    onAddTask={handleAddTask}
                                    onEditTask={handleEditTask}
                                />
                            ))}

                        {/* Add Column */}
                        <div
                            className={cn(
                                "flex flex-col w-80 shrink-0 rounded-xl transition-all duration-300",
                                "border-2 border-dashed border-border/50 hover:border-primary/30",
                                isAddingColumn && "border-primary/50 bg-muted/30"
                            )}
                        >
                            {isAddingColumn ? (
                                <div className="p-4 space-y-3">
                                    <Input
                                        placeholder="Column title..."
                                        value={newColumnTitle}
                                        onChange={(e) => setNewColumnTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleAddColumn();
                                            if (e.key === "Escape") {
                                                setIsAddingColumn(false);
                                                setNewColumnTitle("");
                                            }
                                        }}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={handleAddColumn}>
                                            Add
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setIsAddingColumn(false);
                                                setNewColumnTitle("");
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setIsAddingColumn(true)}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-medium">Add Column</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <DragOverlay>
                        {activeTask && (
                            <div className="w-80 opacity-90">
                                <TaskCard task={activeTask} onEdit={() => { }} />
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Task Dialog */}
            <TaskDialog
                open={taskDialogOpen}
                onOpenChange={setTaskDialogOpen}
                columnId={selectedColumnId}
                task={editingTask}
            />
        </div>
    );
}
