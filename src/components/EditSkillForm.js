import Link from "next/link";
import TextInput from "./inputs/TextInput";
import { isJson } from "@/utils";
import SlugInput from "./inputs/SlugInput";
import TextArea from "./inputs/TextArea";

export default function ({ skillData, setSkillData, onSubmit, editMode }) {
  const makeOnChange = (field) => (e) =>
    setSkillData({ ...skillData, [field]: e.target.value });
  return (
    <form>
      <TextInput
        field="title"
        placeholder="Email Generator"
        label="Title"
        required
        value={skillData.title}
        onChange={makeOnChange("title")}
      />
      <SlugInput
        field="slug"
        placeholder="email-generator"
        label="Url Slug"
        required
        value={skillData.slug}
        onChange={makeOnChange("slug")}
      />
      <TextInput
        field="description"
        placeholder="Enter one-line a description here"
        label="Description"
        required
        value={skillData.description}
        onChange={makeOnChange("description")}
      />
      <TextArea
        field="system_prompt"
        placeholder="Enter a system prompt with {{variables}} here"
        label={
          <span>
            System Prompt (
            <Link
              href="https://github.com/JovianHQ/jobot/tree/main/templates"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Examples
            </Link>
            )
          </span>
        }
        required
        value={skillData.system_prompt}
        onChange={makeOnChange("system_prompt")}
        code
      />
      <TextArea
        field="user_prompt"
        label="User Prompt"
        placeholder="Enter a user prompt with {{variables}} here"
        required
        value={skillData.user_prompt}
        onChange={makeOnChange("user_prompt")}
        code
      />
      <TextArea
        field="inputs"
        placeholder="List the inputs here in Json format"
        label={
          <span>
            Input Fields (
            <Link
              href="https://github.com/aakashns/60a32f4f05ff52fcd80b190492a1911"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Example
            </Link>
            )
          </span>
        }
        required
        value={
          isJson(skillData.inputs)
            ? JSON.stringify(skillData.inputs, null, 2)
            : skillData.inputs
        }
        onChange={makeOnChange("inputs")}
        code
      />
      <div>
        <input
          type="submit"
          value={editMode ? "Save Skill" : "Create Skill"}
          onClick={onSubmit}
          className="rounded-md cursor-pointer bg-blue-500 py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-600 active:bg-blue-700"
        />

        {editMode && (
          <button
            onClick={() => alert("Not implemented")}
            type="submit"
            className="ml-3 rounded-md cursor-pointer bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100"
          >
            Delete Skill
          </button>
        )}
      </div>
    </form>
  );
}
