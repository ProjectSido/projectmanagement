import { create } from "zustand";
import { Board, Column, Task, TaskInsert, ColumnInsert } from "./supabase/types";
import { createClient } from "./supabase/client";

interface KanbanState {
    boards: Board[];
    currentBoard: Board | null;
    columns: Column[];
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Board actions
    fetchBoards: () => Promise<void>;
    setCurrentBoard: (board: Board | null) => void;
    createBoard: (name: string, description?: string, color?: string) => Promise<Board | null>;
    updateBoard: (id: string, data: Partial<Board>) => Promise<void>;
    deleteBoard: (id: string) => Promise<void>;

    // Column actions
    fetchColumns: (boardId: string) => Promise<void>;
    createColumn: (data: ColumnInsert) => Promise<void>;
    updateColumn: (id: string, data: Partial<Column>) => Promise<void>;
    deleteColumn: (id: string) => Promise<void>;
    reorderColumns: (columns: Column[]) => Promise<void>;

    // Task actions
    fetchTasks: (columnIds: string[]) => Promise<void>;
    createTask: (data: TaskInsert) => Promise<void>;
    updateTask: (id: string, data: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    moveTask: (taskId: string, newColumnId: string, newPosition: number) => Promise<void>;

    // Reset state
    resetState: () => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
    boards: [],
    currentBoard: null,
    columns: [],
    tasks: [],
    isLoading: false,
    error: null,

    resetState: () => {
        set({
            boards: [],
            currentBoard: null,
            columns: [],
            tasks: [],
            isLoading: false,
            error: null,
        });
    },

    fetchBoards: async () => {
        set({ isLoading: true, error: null });
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            set({ error: "Not authenticated", isLoading: false });
            return;
        }

        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            set({ error: error.message, isLoading: false });
        } else {
            set({ boards: data || [], isLoading: false });
        }
    },

    setCurrentBoard: (board) => {
        set({ currentBoard: board });
        if (board) {
            get().fetchColumns(board.id);
        } else {
            set({ columns: [], tasks: [] });
        }
    },

    createBoard: async (name, description, color = "#6366f1") => {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            set({ error: "Not authenticated" });
            return null;
        }

        // Use RPC to create board, columns, and member in one transaction
        const { data: boardId, error } = await supabase.rpc('create_board_with_columns', {
            p_name: name,
            p_description: description || null,
            p_color: color,
        });

        if (error) {
            set({ error: error.message });
            return null;
        }

        // Fetch the newly created board to update local state
        if (boardId) {
            const { data: newBoard, error: fetchError } = await supabase
                .from("boards")
                .select("*")
                .eq("id", boardId)
                .single();

            if (newBoard) {
                set((state) => ({ boards: [newBoard, ...state.boards] }));
                return newBoard;
            } else if (fetchError) {
                set({ error: fetchError.message });
            }
        }

        return null;
    },

    updateBoard: async (id, data) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("boards")
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) {
            set({ error: error.message });
        } else {
            set((state) => ({
                boards: state.boards.map((b) =>
                    b.id === id ? { ...b, ...data } : b
                ),
                currentBoard:
                    state.currentBoard?.id === id
                        ? { ...state.currentBoard, ...data }
                        : state.currentBoard,
            }));
        }
    },

    deleteBoard: async (id) => {
        const supabase = createClient();

        const { error } = await supabase.from("boards").delete().eq("id", id);

        if (error) {
            set({ error: error.message });
        } else {
            set((state) => ({
                boards: state.boards.filter((b) => b.id !== id),
                currentBoard: state.currentBoard?.id === id ? null : state.currentBoard,
            }));
        }
    },

    fetchColumns: async (boardId) => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("columns")
            .select("*")
            .eq("board_id", boardId)
            .order("position");

        if (error) {
            set({ error: error.message });
        } else {
            set({ columns: data || [] });
            if (data && data.length > 0) {
                get().fetchTasks(data.map((c) => c.id));
            } else {
                set({ tasks: [] });
            }
        }
    },

    createColumn: async (data) => {
        const supabase = createClient();

        const { data: newColumn, error } = await supabase
            .from("columns")
            .insert(data)
            .select()
            .single();

        if (error) {
            set({ error: error.message });
        } else if (newColumn) {
            set((state) => ({ columns: [...state.columns, newColumn] }));
        }
    },

    updateColumn: async (id, data) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("columns")
            .update(data)
            .eq("id", id);

        if (error) {
            set({ error: error.message });
        } else {
            set((state) => ({
                columns: state.columns.map((c) =>
                    c.id === id ? { ...c, ...data } : c
                ),
            }));
        }
    },

    deleteColumn: async (id) => {
        const supabase = createClient();

        const { error } = await supabase.from("columns").delete().eq("id", id);

        if (error) {
            set({ error: error.message });
        } else {
            set((state) => ({
                columns: state.columns.filter((c) => c.id !== id),
                tasks: state.tasks.filter((t) => t.column_id !== id),
            }));
        }
    },

    reorderColumns: async (columns) => {
        const supabase = createClient();

        // Update positions locally first
        set({ columns });

        // Update in database
        const updates = columns.map((col, index) => ({
            id: col.id,
            position: index,
        }));

        for (const update of updates) {
            await supabase
                .from("columns")
                .update({ position: update.position })
                .eq("id", update.id);
        }
    },

    fetchTasks: async (columnIds) => {
        if (columnIds.length === 0) {
            set({ tasks: [] });
            return;
        }

        const supabase = createClient();

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .in("column_id", columnIds)
            .order("position");

        if (error) {
            set({ error: error.message });
        } else {
            set({ tasks: data || [] });
        }
    },

    createTask: async (data) => {
        const supabase = createClient();

        const { data: newTask, error } = await supabase
            .from("tasks")
            .insert(data)
            .select()
            .single();

        if (error) {
            set({ error: error.message });
        } else if (newTask) {
            set((state) => ({ tasks: [...state.tasks, newTask] }));
        }
    },

    updateTask: async (id, data) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("tasks")
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) {
            set({ error: error.message });
        } else {
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
            }));
        }
    },

    deleteTask: async (id) => {
        const supabase = createClient();

        const { error } = await supabase.from("tasks").delete().eq("id", id);

        if (error) {
            set({ error: error.message });
        } else {
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            }));
        }
    },

    moveTask: async (taskId, newColumnId, newPosition) => {
        const supabase = createClient();
        const { tasks } = get();

        // Get the task being moved
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Update position of tasks in the target column
        const tasksInNewColumn = tasks
            .filter((t) => t.column_id === newColumnId && t.id !== taskId)
            .sort((a, b) => a.position - b.position);

        // Insert the task at the new position
        tasksInNewColumn.splice(newPosition, 0, {
            ...task,
            column_id: newColumnId,
            position: newPosition,
        });

        // Update all positions
        const updatedTasks = tasksInNewColumn.map((t, index) => ({
            ...t,
            position: index,
        }));

        // Update local state immediately for responsiveness
        set((state) => ({
            tasks: state.tasks.map((t) => {
                if (t.id === taskId) {
                    return { ...t, column_id: newColumnId, position: newPosition };
                }
                const updated = updatedTasks.find((ut) => ut.id === t.id);
                return updated || t;
            }),
        }));

        // Update in database
        const { error } = await supabase
            .from("tasks")
            .update({ column_id: newColumnId, position: newPosition })
            .eq("id", taskId);

        if (error) {
            set({ error: error.message });
            // Revert on error
            get().fetchTasks(get().columns.map((c) => c.id));
        }
    },
}));
