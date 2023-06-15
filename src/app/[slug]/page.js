"use client";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import useOpenAIMessages from "@/utils/useOpenai";
import MessageHistory from "@/components/MessageHistory";
import { getTemplate } from "@/network";
import MessageInput from "@/components/MessageInput";
import Template from "@/components/Template";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TemplatePage({}) {
  const name = "Rodoc";
  const { history, sending, sendMessages } = useOpenAIMessages();
  const { slug } = useParams();
  const [template, setTemplate] = useState("");

  useEffect(() => {
    getTemplate(slug).then((temp) => setTemplate(temp));
  }, [slug]);

  if (!template) {
    return null;
  }
  return (
    <>
      <Head>
        <title>
          {template.title} - {name}
        </title>
        <meta name="description" content={template.description} />
        <link rel="icon" href="/rodoc_icon.png" type="image/png" />
        <meta property="og:image" content="/jobot_meta.png" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />
        {history.length === 1 && (
          <Template template={template} sendMessages={sendMessages} />
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
