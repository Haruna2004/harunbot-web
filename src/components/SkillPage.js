"use client";

import Head from "next/head";
import Navbar from "@/components/Navbar";
import useOpenAIMessages from "@/utils/useOpenai";
import MessageHistory from "@/components/MessageHistory";
import MessageInput from "@/components/MessageInput";
import SkillForm from "./SkillForm";

export function SkillPage({ skill }) {
  const name = "Jobot";
  const { history, sending, sendMessages } = useOpenAIMessages();

  if (!skill) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          {skill.title} - {name}
        </title>
        <meta name="description" content={skill.description} />
        <link rel="icon" href="/jobot_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />
        {history.length === 1 && (
          <SkillForm skill={skill} sendMessages={sendMessages} />
        )}
        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sending={sending} sendMessages={sendMessages} />
          </>
        )}
      </div>
    </>
  );
}
