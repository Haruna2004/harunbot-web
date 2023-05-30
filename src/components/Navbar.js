import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const user = supabase.auth.getSession();
  return (
    <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
      <div className="text-xl font-bold">Rodoc</div>
      <div>
        {user ? (
          <Link href="/logout">Log Out</Link>
        ) : (
          <Link href="/login">Log In</Link>
        )}
      </div>
    </nav>
  );
}
