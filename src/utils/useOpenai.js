"use client";
import { streamOpenAIResponse, postOpenAIMessages } from "./openai";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
// import { useLoginDialog } from ".";

const SYSTEM_MESSAGE =
  "You are Rodoc, a helpful and versatile AI medical assistant created by Haruna using state-of the art ML models and APIs.";

const DEFUALT_HISTORY = [{ role: "system", content: SYSTEM_MESSAGE }];

export default function useOpenAIMessages(initialHistory = DEFUALT_HISTORY) {
  //   const { setLoginOpen } = useLoginDialog();
  const [history, setHistory] = useState(initialHistory);
  const [sending, setSending] = useState(false);
  const user = supabase.auth.getSession();

  const sendMessages = async (newMessages) => {
    if (!user) {
      toast("Please log in to send a message");
      //   setLoginOpen(true);
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
