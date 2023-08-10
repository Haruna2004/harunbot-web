import { OpenAIStream } from "@/utils/openai";
// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";

export const runtime = "edge";

export async function POST(req, res) {
  // Todo - verify the user from authenticated user
  // const autenticated = await verifyServerSideAuth(req, res);

  // if (!autenticated) {
  //   return NextResponse.json({ statusText: "Unauthorized" }, { status: 401 });
  // }

  const body = await req.json();
  body.model = "gpt-3.5-turbo";

  const headers = getChatResponseHeaders();

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
