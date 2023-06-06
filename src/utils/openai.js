"use client";
import { supabase } from "@/lib/supabaseClient";
import { createParser } from "eventsource-parser";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLoginDialog } from ".";

/* Sends a request to the OpenAI API to generate a text completion for 
the given body and returns a readable stream of encoded text data */
export const OpenAIStream = async (body) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status !== 200) {
    throw new Error("openai:", "OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  console.log("fromopenai:", stream);
  return stream;
};

export async function streamOpenAIResponse(response, callback) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = "";
  let isFirst = true;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    text += chunkValue;
    callback(text, isFirst);
    isFirst = false;
  }
}

export async function postOpenAIMessages(messages) {
  return await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages, stream: true }),
  });
}

const SYSTEM_MESSAGE =
  "You are Rodoc, a helpful and versatile AI medical assistant created by Haruna using state-of the art ML models and APIs.";

const DEFUALT_HISTORY = [{ role: "system", content: SYSTEM_MESSAGE }];

export default function useOpenAIMessages(initialHistory = DEFUALT_HISTORY) {
  const { setLoginOpen } = useLoginDialog();
  const [history, setHistory] = useState(initialHistory);
  const [sending, setSending] = useState(false);
  const user = supabase.auth.getSession();

  const sendMessages = async (newMessages) => {
    if (!user) {
      toast("Please log in to send a message");
      setLoginOpen(true);
      return;
    }

    const oldHistory = history;
    const newHistory = [...history, ...newMessages];
    setSending(true);
    setHistory(newHistory);

    const response = await postOpenAIMessages(newHistory);

    if (!response.ok || !response.body) {
      setSending(false);
      setHistory(oldHistory);
      toast.error("Failed to send:" + response.statusText);
    }

    let finalHistory;
    await streamOpenAIResponse(response, (content) => {
      finalHistory = [...newHistory, { role: "assistant", content }];
      setHistory(finalHistory);
    });

    setSending(false);

    return finalHistory;
  };
  return { history, setHistory, sending, sendMessages };
}
