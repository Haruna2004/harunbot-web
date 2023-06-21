"use client";
import Head from "next/head";
import EditSkillForm from "./EditSkillForm";
import Navbar from "@/components/Navbar";
import { isJson } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

export default function EditSkillPage({ skill }) {
  const [skillData, setSkillData] = useState(skill);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const updatedSkill = {
        title: skillData.title,
        slug: skillData.slug,
        description: skillData.description,
        system_prompt: skillData.system_prompt,
        user_prompt: skillData.user_prompt,
        inputs: isJson(skillData.inputs)
          ? skillData.inputs
          : JSON.parse(skillData.inputs),
        user_id: user.id,
      };

      const { error } = supabase
        .from("skills")
        .update(updatedSkill)
        .eq("id", skillData.id);

      if (error) throw error;

      toast.success("Skill updated successfully");
      router.push(`/${skill.profiles.username}/${updatedSkill.slug}`);
    } catch (error) {
      toast.error("Failed to update skill:" + error.message);
      console.error("Error updating skill:", error);
    }
  }

  if (!skill) return null;

  return (
    <>
      <Head>
        <title>{`Edit Skill - ${skill.title}`}</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="px-2 flex-1 overflow-y-auto">
          <div className="mx-auto my-4 w-full max-w-4xl">
            <h1 className="text-center mx-auto text-4xl font-medium">
              Build a Skill
            </h1>
            <EditSkillForm
              skillData={skillData}
              setSkillData={setSkillData}
              onSubmit={handleSubmit}
              editMode
            />
          </div>
        </div>
      </div>
    </>
  );
}
