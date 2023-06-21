import { SkillPage } from "@/components/SkillPage";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function page({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const slug = params.slug;
  const username = params.username;
  const { data: skills, error } = await supabase
    .from("skills")
    .select("*,profiles(username,first_name,last_name)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .limit(1);

  if (error || !skills || skills.length === 0) {
    return <div>not found</div>;
  }

  return <SkillPage skill={skills[0]} />;
}
