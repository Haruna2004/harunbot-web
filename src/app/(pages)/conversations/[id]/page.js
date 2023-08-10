import Conversation from "@/components/Conversation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function page({ params }) {
  const supabase = createServerComponentClient({ cookies });

  const id = params.id;

  const {
    data: { user },
    error: err1,
  } = await supabase.auth.getUser();

  // Todo - change notfound
  if (err1 || !user) {
    return {
      notFound: true,
    };
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*, messages(id, role, created_at, content)")
    .eq("id", id)
    .single();

  if (!data || !data.user_id == user.id || error) {
    return {
      notFound: true,
    };
  }

  return <Conversation conversation={data} />;
}
