"use client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Logout() {
  const superbase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    superbase.auth.signOut().then(() => {
      router.push("/");
    });
  }, []);

  return <div></div>;
}
