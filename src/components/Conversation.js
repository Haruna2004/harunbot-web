"use client";

import useOpenAIMessages from "@/utils/useOpenai";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Layout from "./Layout";
import MessageHistory from "./MessageHistory";
import Navbar from "./Navbar";
import MessageInput from "./MessageInput";

export default function Conversation({ conversation }) {
  const queryId = useParams().id;
  const supabase = useSupabaseClient();

  const { history, setHistory, sending, sendMessages } = useOpenAIMessages(
    conversation.messages
  );

  useEffect(() => {
    setHistory(conversation.messages);
  }, [conversation, setHistory]);

  async function handleSend(newMessages) {
    const newHistory = await sendMessages(newMessages);

    if (!newHistory) {
      return false;
    }

    const savedMessages = newHistory.filter((m) => m.id);

    const unsavedMessages = newHistory
      .filter((m) => !m.id)
      .map((message) => ({
        ...message,
        conversation_id: queryId,
      }));

    const { data: newMessagesData, error: messagesError } = await supabase
      .from("messages")
      .insert(unsavedMessages)
      .select();

    if (messagesError) {
      toast.error("Failed to save messages. " + messagesError.message);
      console.error(messagesError);
      return false;
    }

    setHistory([...savedMessages, ...newMessagesData]);

    return true;
  }

  if (!conversation) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`${conversation.title} - Jobot`}</title>
        <meta
          name="description"
          content={`${name} is a general pupose, programmable & extensible AI developed by Haruna, using start of the art machine learning models and APIs.`}
        />
        <link rel="icon" href="/rodoc_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>

      <Layout>
        <Navbar />
        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sendMessages={handleSend} sending={sending} />
          </>
        )}
      </Layout>
    </>
  );
}
