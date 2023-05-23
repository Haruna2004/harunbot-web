"use client";

import { useState, React } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const name = "Rodoc";
  const SYSTEM_MESSAGE =
    "You are RoDoc, a trained Doctor and versatile AI created by Haruna Faruk using state-of the art ML models and APIs";
  const [messageHistory, setMessageHistory] = useState([
    { role: "system", content: SYSTEM_MESSAGE },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const API_URL = "https://api.openai.com/v1/chat/completions";
  async function sendRequest() {
    // update the message history
    const newMessage = { role: "user", content: userMessage };
    const newMessageHistory = [...messageHistory, newMessage];
    setMessageHistory(newMessageHistory);
    setUserMessage("");
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: newMessageHistory,
      }),
    });
    const data = await response.json();
    const newBotMessage = data.choices[0].message;
    const newMessageHistory2 = [...newMessageHistory, newBotMessage];
    setMessageHistory(newMessageHistory2);
  }

  return (
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
          {messageHistory
            .filter((message) => message.role !== "system")
            .map((message, index) => (
              <div key={index} className="mt-3">
                <div className="fon-bold">
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
  );
}
