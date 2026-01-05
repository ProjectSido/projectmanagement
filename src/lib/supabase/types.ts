export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            boards: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    color: string;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    color?: string;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    color?: string;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            columns: {
                Row: {
                    id: string;
                    title: string;
                    board_id: string;
                    position: number;
                    color: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    board_id: string;
                    position: number;
                    color?: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    board_id?: string;
                    position?: number;
                    color?: string;
                    created_at?: string;
                };
            };
            tasks: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    column_id: string;
                    position: number;
                    priority: "low" | "medium" | "high" | "urgent";
                    due_date: string | null;
                    labels: string[];
                    assigned_to: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    column_id: string;
                    position: number;
                    priority?: "low" | "medium" | "high" | "urgent";
                    due_date?: string | null;
                    labels?: string[];
                    assigned_to?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    column_id?: string;
                    position?: number;
                    priority?: "low" | "medium" | "high" | "urgent";
                    due_date?: string | null;
                    labels?: string[];
                    assigned_to?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            board_members: {
                Row: {
                    id: string;
                    board_id: string;
                    user_id: string;
                    role: "owner" | "admin" | "member" | "viewer";
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    board_id: string;
                    user_id: string;
                    role?: "owner" | "admin" | "member" | "viewer";
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    board_id?: string;
                    user_id?: string;
                    role?: "owner" | "admin" | "member" | "viewer";
                    created_at?: string;
                };
            };
        };
        Views: Record<string, never>;
        Functions: {
            create_board_with_columns: {
                Args: {
                    p_name: string;
                    p_description?: string | null;
                    p_color?: string;
                };
                Returns: string;
            };
        };
        Enums: {
            priority: "low" | "medium" | "high" | "urgent";
            member_role: "owner" | "admin" | "member" | "viewer";
        };
    };
}

// Export types for convenience
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Board = Database["public"]["Tables"]["boards"]["Row"];
export type Column = Database["public"]["Tables"]["columns"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type BoardMember = Database["public"]["Tables"]["board_members"]["Row"];

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type BoardInsert = Database["public"]["Tables"]["boards"]["Insert"];
export type ColumnInsert = Database["public"]["Tables"]["columns"]["Insert"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type BoardMemberInsert = Database["public"]["Tables"]["board_members"]["Insert"];

export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type BoardUpdate = Database["public"]["Tables"]["boards"]["Update"];
export type ColumnUpdate = Database["public"]["Tables"]["columns"]["Update"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type BoardMemberUpdate = Database["public"]["Tables"]["board_members"]["Update"];
