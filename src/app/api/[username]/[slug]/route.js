import { OpenAIStream } from "@/utils/openai";
import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fillTemplate } from "@/utils";

export const runtime = "edge";
const SYSTEM_MESSAGE =
  "You are Rodoc, a helpful and versatile AI medical assistant created by Haruna using state-of the art ML models and APIs.";

export async function GET(req, { params }) {
  const supabase = createRouteHandlerClient({ cookies });
  const username = params.username;
  const slug = params.slug;

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*,profile:profiles(username,first_name,last_name)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .limit(1);

  if (error || skills?.length < 1) {
    return new Response("skill not found", { status: 404 });
  }

  const skill = skills[0];

  const headers = getChatResponseHeaders();

  headers["Content-Type"] = "application/json";
  return new Response(JSON.stringify({ skill: skill }), {
    headers,
    status: 200,
  });
}

export async function POST(req, { params }) {
  // Todo - verify auth of user on the searver
  // const autenticated = await verifyServerSideAuth(req, res);
  const supabase = createRouteHandlerClient({ cookies });

  // if (!autenticated) {
  //   return NextResponse.json({ statusText: "Unauthorized" }, { status: 401 });
  // }
  // const { searchParams } = new URL(req.url);

  // const slug = searchParams.get("slug");
  // const username = searchParams.get("username");
  const username = params.username;
  const slug = params.slug;

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*,profile:profiles(username,first_name,last_name)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .limit(1);

  if (error || skills?.length < 1) {
    res.status(404).send("Skill not found");
  }

  const skill = skills[0];

  const headers = getChatResponseHeaders();

  const body = await req.json();
  body.model = "gpt-3.5-turbo";

  const inputData = body.inputData;

  const filledMessages = [
    { role: "system", content: SYSTEM_MESSAGE },
    { role: "system", content: fillTemplate(skill.system_prompt, inputData) },
    { role: "user", content: fillTemplate(skill.user_prompt, inputData) },
  ];

  body.messages = [...filledMessages, ...(body.messages || [])];

  delete body.inputData;

  if (body.stream) {
    const stream = await OpenAIStream(body);
    return new Response(stream, { status: 200, headers });
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    const resJson = await res.text();
    console.log(resJson);
    headers["Content-Type"] = "application/json";
    return new Response(resJson, { status: 200, headers });
  }
}
