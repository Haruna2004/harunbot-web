import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
  const username = params.username;
  const supabase = createRouteHandlerClient({ cookies });
  const { data: profile, error: err1 } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (err1) {
    return NextResponse.json({ error: err1 }, { status: 404 });
  }

  const { data: skills, error: err2 } = await supabase
    .from("skills")
    .select(
      `
    *`
    )
    .eq("user_id", profile.id);

  if (err2) {
    return NextResponse.json({ error: err2 }, { status: 404 });
  }
  return NextResponse.json({ skills, profile }, { status: 200 });
}
