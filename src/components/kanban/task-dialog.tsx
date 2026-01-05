"use client";

import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useKanbanStore } from "@/lib/store";
import { Task } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    columnId: string | null;
    task?: Task | null;
}

const priorities = [
    { value: "low", label: "Low", color: "bg-emerald-500" },
    { value: "medium", label: "Medium", color: "bg-amber-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-rose-500" },
];

export default function TaskDialog({
    open,
    onOpenChange,
    columnId,
    task,
}: TaskDialogProps) {
    const { columns, tasks, createTask, updateTask } = useKanbanStore();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
    const [dueDate, setDueDate] = useState<Date | undefined>();
    const [labels, setLabels] = useState("");
    const [selectedColumn, setSelectedColumn] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || "");
            setPriority(task.priority);
            setDueDate(task.due_date ? new Date(task.due_date) : undefined);
            setLabels(task.labels?.join(", ") || "");
            setSelectedColumn(task.column_id);
        } else {
            setTitle("");
            setDescription("");
            setPriority("medium");
            setDueDate(undefined);
            setLabels("");
            setSelectedColumn(columnId || "");
        }
    }, [task, columnId, open]);

    const handleSubmit = async () => {
        if (!title.trim() || !selectedColumn) return;

        setIsSubmitting(true);

        try {
            const labelArray = labels
                .split(",")
                .map((l) => l.trim())
                .filter(Boolean);

            if (task) {
                // Update existing task
                await updateTask(task.id, {
                    title: title.trim(),
                    description: description.trim() || null,
                    priority,
                    due_date: dueDate?.toISOString() || null,
                    labels: labelArray,
                    column_id: selectedColumn,
                });
            } else {
                // Create new task
                const tasksInColumn = tasks.filter((t) => t.column_id === selectedColumn);
                const maxPosition = tasksInColumn.length > 0
                    ? Math.max(...tasksInColumn.map((t) => t.position))
                    : -1;

                await createTask({
                    title: title.trim(),
                    description: description.trim() || null,
                    column_id: selectedColumn,
                    position: maxPosition + 1,
                    priority,
                    due_date: dueDate?.toISOString() || null,
                    labels: labelArray,
                });
            }

            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div
                            className={cn(
                                "w-2 h-2 rounded-full",
                                priorities.find((p) => p.value === priority)?.color
                            )}
                        />
                        {task ? "Edit Task" : "Create New Task"}
                    </DialogTitle>
                    <DialogDescription>
                        {task
                            ? "Update the task details below"
                            : "Fill in the details for your new task"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="Task title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Add a description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Column and Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Column</Label>
                            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {columns.map((col) => (
                                        <SelectItem key={col.id} value={col.id}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: col.color }}
                                                />
                                                {col.title}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={priority}
                                onValueChange={(val) =>
                                    setPriority(val as "low" | "medium" | "high" | "urgent")
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorities.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", p.color)} />
                                                {p.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !dueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate
                                        ? format(dueDate, "PPP", { locale: localeId })
                                        : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate}
                                    onSelect={setDueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Labels */}
                    <div className="space-y-2">
                        <Label htmlFor="labels">Labels</Label>
                        <Input
                            id="labels"
                            placeholder="Enter labels separated by commas..."
                            value={labels}
                            onChange={(e) => setLabels(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Example: frontend, bug fix, urgent
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title.trim() || !selectedColumn || isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
