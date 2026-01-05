"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutGrid,
    ChevronDown,
    User,
    LogOut,
    Plus,
    Settings,
    Edit3,
    Trash2,
    Moon,
    Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useKanbanStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { Board } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const boardColors = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#ec4899", // pink
    "#f43f5e", // rose
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#14b8a6", // teal
    "#06b6d4", // cyan
    "#3b82f6", // blue
];

interface SidebarProps {
    theme: "light" | "dark";
    onThemeChange: (theme: "light" | "dark") => void;
}

export default function Sidebar({ theme, onThemeChange }: SidebarProps) {
    const router = useRouter();
    const { user, profile, signOut, isLoading: authLoading } = useAuth();
    const {
        boards,
        currentBoard,
        fetchBoards,
        setCurrentBoard,
        createBoard,
        updateBoard,
        deleteBoard,
        resetState,
    } = useKanbanStore();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#6366f1");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBoards();
        }
    }, [user, fetchBoards]);

    const handleCreateBoard = async () => {
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const newBoard = await createBoard(name.trim(), description.trim(), color);
            if (newBoard) {
                setCurrentBoard(newBoard);
            }
            resetForm();
            setCreateDialogOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateBoard = async () => {
        if (!editingBoard || !name.trim()) return;

        setIsSubmitting(true);
        try {
            await updateBoard(editingBoard.id, {
                name: name.trim(),
                description: description.trim() || null,
                color,
            });
            resetForm();
            setEditingBoard(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBoard = async () => {
        if (!deletingBoard) return;

        setIsSubmitting(true);
        try {
            await deleteBoard(deletingBoard.id);
            setDeleteDialogOpen(false);
            setDeletingBoard(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        resetState();
        await signOut();
        router.push("/login");
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setColor("#6366f1");
    };

    const openEditDialog = (board: Board) => {
        setName(board.name);
        setDescription(board.description || "");
        setColor(board.color);
        setEditingBoard(board);
    };

    const openDeleteDialog = (board: Board) => {
        setDeletingBoard(board);
        setDeleteDialogOpen(true);
    };

    const getInitials = (name: string | null | undefined, email: string | null | undefined) => {
        if (name) {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return "U";
    };

    return (
        <div
            className={cn(
                "shrink-0 border-r border-border/50 bg-gradient-to-b from-muted/30 to-background flex flex-col transition-all duration-300 ease-in-out",
                isCollapsed ? "w-[70px]" : "w-64"
            )}
        >
            {/* Logo & Toggle */}
            <div className={cn("p-4 border-b border-border/50 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <LayoutGrid className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="font-bold text-base truncate">Kanban</h1>
                        </div>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
            </div>

            {/* User Profile */}
            <div className="p-3 border-b border-border/50">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors",
                            isCollapsed && "justify-center px-0"
                        )}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={profile?.avatar_url || undefined} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {getInitials(profile?.full_name, profile?.email || user?.email)}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {profile?.full_name || "User"}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground truncate">
                                            {profile?.email || user?.email}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                                </>
                            )}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isCollapsed ? "center" : "start"} side={isCollapsed ? "right" : "bottom"} className="w-56">
                        <DropdownMenuItem onClick={() => router.push("/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-rose-500 focus:text-rose-500">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Boards List */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className={cn("p-4 pb-2 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && (
                        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            My Boards
                        </h2>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                            resetForm();
                            setCreateDialogOpen(true);
                        }}
                        title="Create New Board"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-3">
                    <div className="space-y-1 pb-4">
                        {boards.map((board) => (
                            <div
                                key={board.id}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                                    currentBoard?.id === board.id
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted",
                                    isCollapsed && "justify-center px-2"
                                )}
                                onClick={() => setCurrentBoard(board)}
                                title={isCollapsed ? board.name : undefined}
                            >
                                <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: board.color }}
                                />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 truncate text-sm font-medium">
                                            {board.name}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Settings className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEditDialog(board)}>
                                                    <Edit3 className="mr-2 h-3 w-3" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-rose-500 focus:text-rose-500"
                                                    onClick={() => openDeleteDialog(board)}
                                                >
                                                    <Trash2 className="mr-2 h-3 w-3" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </>
                                )}
                            </div>
                        ))}

                        {boards.length === 0 && !authLoading && (
                            <div className="text-center py-8 text-muted-foreground">
                                {!isCollapsed && (
                                    <>
                                        <p className="text-sm">No boards yet</p>
                                        <p className="text-xs mt-1">Create your first board!</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            <Separator />

            {/* Theme Toggle */}
            <div className="p-4">
                <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between mb-4")}>
                    {!isCollapsed && <span className="text-sm text-muted-foreground">Theme</span>}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
                        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? (
                            <Moon className="h-4 w-4" />
                        ) : (
                            <Sun className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                {!isCollapsed && (
                    <p className="text-[10px] text-muted-foreground text-center">
                        v0.1.0
                    </p>
                )}
            </div>

            {/* Create/Edit Board Dialog */}
            <Dialog
                open={createDialogOpen || !!editingBoard}
                onOpenChange={(open) => {
                    if (!open) {
                        setCreateDialogOpen(false);
                        setEditingBoard(null);
                        resetForm();
                    }
                }}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingBoard ? "Edit Board" : "Create New Board"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingBoard
                                ? "Update your board details"
                                : "Give your board a name and pick a color"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="Project name..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="What's this board for?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="grid grid-cols-6 gap-2">
                                {boardColors.map((c) => (
                                    <button
                                        key={c}
                                        className={cn(
                                            "w-8 h-8 rounded-lg ring-offset-2 ring-offset-background transition-all hover:scale-110",
                                            color === c && "ring-2 ring-primary"
                                        )}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setColor(c)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCreateDialogOpen(false);
                                setEditingBoard(null);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={editingBoard ? handleUpdateBoard : handleCreateBoard}
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting
                                ? "Saving..."
                                : editingBoard
                                    ? "Update Board"
                                    : "Create Board"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-rose-500 flex items-center gap-2">
                            <Trash2 className="h-5 w-5" />
                            Delete Board
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">"{deletingBoard?.name}"</span>?
                            This action cannot be undone and will delete all columns and tasks associated with this board.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteBoard}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Deleting..." : "Delete Board"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
