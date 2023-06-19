import { OpenAIStream } from "@/utils/openai";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
// import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "edge";

export async function POST(req, res) {
  // const supabase = createMiddlewareClient({ req, res });
  const body = await req.json();

  body.model = "gpt-3.5-turbo";

  // you can be back to change this to (data: {user},error)
  const user = await supabase.auth.getSession();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = await OpenAIStream(body);

  return new Response(stream, { status: 200 });
}
