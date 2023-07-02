import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: skills, error } = await supabase.from("skills").select(`
    *,
    profile:profiles (
        username,
        first_name,
        last_name
    )
    `);
  if (error) {
    return NextResponse.json({ error: error }, { status: 404 });
  }
  return NextResponse.json({ skills }, { status: 200 });
}
