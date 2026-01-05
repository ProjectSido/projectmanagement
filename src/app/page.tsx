import { redirect } from "next/navigation";

// Root page - middleware will handle redirection based on auth status
// This is a fallback in case middleware doesn't redirect
export default function Home() {
  redirect("/login");
}
