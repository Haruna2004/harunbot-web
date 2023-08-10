"use client";
import { fillTemplate, makeDisplayName } from "@/utils";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import React, { useState } from "react";
import SkillInput from "./SkillInput";

export default function SkillForm({ skill, sendMessages }) {
  const user = useUser();
  const [inputData, setInputData] = useState({});
  const inputs = skill.inputs || [];

  function startConversation() {
    const filledMessages = [
      { role: "system", content: fillTemplate(skill.system_prompt, inputData) },
      { role: "user", content: fillTemplate(skill.user_prompt, inputData) },
    ];
    sendMessages(filledMessages);
  }

  if (!skill) {
    return <div>not found</div>;
  }

  return (
    <div className="mx-auto my-4 w-full max-w-4xl px-2">
      <h1 className="text-center mx-auto text-4xl font-medium">
        {skill.title}
      </h1>
      <div className="mx-auto mt-4 mb-4 max-w-xl text-center text-gray-500 sm:text-base">
        {skill.description}
      </div>
      <div>
        {inputs.map((inputInfo) => (
          <SkillInput
            key={inputInfo.field}
            {...inputInfo}
            value={inputData[inputInfo.field]}
            onChange={(value) =>
              setInputData({ ...inputData, [inputInfo.field]: value })
            }
          />
        ))}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="rounded-md  bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700 dark:ring-0"
          onClick={startConversation}
        >
          Start Conversation
        </button>
        {skill.user_id !== user?.id ? (
          <div className="text-gray-500 font-medium text-sm">
            Author: {makeDisplayName(skill.profiles)}
          </div>
        ) : (
          <Link
            href={`/${skill.profiles.username}/${skill.slug}/edit`}
            className="ml-3 rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
            type="submit"
          >
            Edit Skill
          </Link>
        )}
      </div>
    </div>
  );
}
