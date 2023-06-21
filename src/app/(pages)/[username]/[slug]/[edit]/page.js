import EditSkillPage from "@/components/EditSkillPage";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function page({ params }) {
  const supabase = createServerComponentClient({ cookies });

  const slug = params.slug;
  const username = params.username;

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*,profiles(username, first_name, last_name)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .limit(1);

  if (error) {
    console.error("Failed to fetch skill for slug: " + slug, error);
    return {
      notFound: true,
    };
  }

  const skill = skills[0];

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session.user;

  if (user?.id != skill?.user_id) {
    console.error(
      "User is not the author",
      "user.id",
      user.id,
      "skill.user_id",
      skill.user_id
    );
    return <div>User is not the author</div>;
  }

  return <EditSkillPage skill={skill} />;
}
