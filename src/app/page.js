"use client";

import Head from "next/head";
import Navbar from "../components/Navbar";
import useOpenAIMessages from "@/utils/useOpenai";
import MessageInput from "@/components/MessageInput";
import MessageHistory from "@/components/MessageHistory";
import Templates from "@/components/Templates";
// import Skills from "@/components/Skills";
// import { supabase } from "@/lib/supabaseClient";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import PageLayout from "../components/PageLayout";

export default function Home() {
  const name = "Jobot";
  const { history, sending, sendMessages } = useOpenAIMessages();
  // const user = supabase.auth.getSession();
  // const router = useRouter();

  //Connect To supabase

  // Send the Prompt
  //handle send to here also to superbase
  async function handleSend(newMessages) {
    return;
  }

  return (
    <>
      <Head>
        <title>Rodoc- Health Overseer AI</title>
        <meta
          name="description"
          content={`${name} is a general pupose, programmable & extensible AI developed by Haruna, using start of the art machine learning models and APIs.`}
        />
        <link rel="icon" href="/rodoc_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>

      <div className="h-screen flex flex-col">
        <Navbar />
        {history.length <= 1 && (
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl overflow-y-auto w-full">
              <h1 className="mx-auto mt-4 my-6 w-full max-w-4xl text-3xl md:text-4xl font-medium text-center">
                {name} - The AI That Does Everything
              </h1>
            </div>

            <MessageInput
              sending={sending}
              sendMessages={sendMessages}
              placeholder="Ask me anything..."
            />

            <Templates />
          </div>
        )}

        {history.length > 1 && (
          <>
            <MessageHistory history={history} />
            <MessageInput sendMessages={sendMessages} sending={sending} />
          </>
        )}
      </div>
    </>
  );
}
