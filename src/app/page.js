"use client";

import { useState, React } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Head from "next/head";
import { createParser } from "eventsource-parser";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const name = "Rodoc";
  const SYSTEM_MESSAGE =
    "You are Rodoc, a trained Doctor and versatile AI created by Haruna Faruk using state-of the art ML models and APIs";
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_MESSAGE },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const API_URL = "https://api.openai.com/v1/chat/completions";

  // Send the Prompt
  const sendRequest = async () => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        } else {
          return "";
        }
      });

      // eslint-disable-next-line
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Rodoc- Health Overseer AI</title>
      </Head>
      <div className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
          <div className="text-xl font-bold">{name}</div>
          <div className="">
            <input
              type="password"
              className="border p-1 rounded outline-none"
              placeholder="Paste API Key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </nav>
        {/* Message History */}
        <div className="flex-1 overflow-y-scroll">
          <div className="max-w-screen-md mx-auto w-full px-4">
            {messages
              .filter((message) => message.role !== "system")
              .map((message, index) => (
                <div key={index} className="my-3">
                  <div className="font-bold">
                    {message.role === "user" ? "You" : name}
                  </div>
                  <div className="text-lg prose">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Message Input Box */}
        <div>
          <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4">
            <textarea
              className="border outline-none text-lg rounded-md p-1 flex-1"
              rows={1}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <button
              onClick={sendRequest}
              className="bg-blue-500 hover:bg-blue-600 border rounded-md text-white text-lg w-20 p-1 ml-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
