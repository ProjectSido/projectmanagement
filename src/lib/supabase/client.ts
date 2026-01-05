import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("Supabase Client Init:", {
        url,
        keyLength: key?.length,
        keyStart: key?.substring(0, 10)
    });

    if (!url || !key) {
        console.error("❌ Missing Supabase Credentials!");
    }

    return createBrowserClient<Database>(
        url!,
        key!
    );
}
