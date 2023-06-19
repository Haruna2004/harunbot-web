import { toast } from "react-hot-toast";

//Helpers for Templates
export const TEMPLATES_BASE_URL =
  "https://raw.githubusercontent.com/JovianHQ/jobot/main/templates";

export async function getTemplates() {
  const res = await fetch(
    `${TEMPLATES_BASE_URL}/index.json?t=${new Date().getTime()}`,
    {
      cache: "no-store",
    }
  );
  return await res.json();
}

export async function getSystemPrompt(slug) {
  const res = await fetch(
    `${TEMPLATES_BASE_URL}/${slug}/system.md?t=${new Date().getTime()}`,
    {
      cache: "no-store",
    }
  );
  return res.text();
}

export async function getUserPrompts(slug) {
  const res = await fetch(
    `${TEMPLATES_BASE_URL}/${slug}/user.md?t=${new Date().getTime()}`,
    {
      cache: "no-store",
    }
  );
  return res.text();
}

export async function getTemplate(slug) {
  const [templates, systemPrompt, userPrompt] = await Promise.all([
    getTemplates(),
    getSystemPrompt(slug),
    getUserPrompts(slug),
  ]);

  const template = templates.find((t) => t.slug === slug);

  if (!template) {
    return;
  }
  template.systemPrompt = systemPrompt;
  template.userPrompt = userPrompt;

  return template;
}

// Helper to get supabase profile
export async function fetchUserProfile(supabase, user) {
  if (!user) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error while fetch user profile", error);
  }
}

export async function updateUserProfile(supabase, profileData) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", profileData.id);

    if (error) {
      throw error;
    }

    toast.success("Profile updated!");
    return true;
  } catch (e) {
    toast.error("Failed to update profile");
    console.error("Failed to update profile", e);
  }
}
