"use client";

import Navbar from "@/components/Navbar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  const supabase = createClientComponentClient();

  async function sendCode() {
    console.log("Email:", email);
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "https://example.com/welcome",
      },
    });

    if (error) {
      toast.error("Failed to send verification code");
      console.log("Failed to send verification code", error);
      return;
    }

    if (data) {
      toast.success("Verification code sent. Check you email!");
      console.log("Verification code sent");
    }
  }

  async function submitCode() {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "magiclink",
    });

    if (data?.user) {
      toast.success("Signed in successfully");
      console.log("Signed in successfully", data);
      router.push("/");
      return;
    }
    if (error) {
      console.error("Failed to sign in", error);
    }

    const { data: d2, error: e2 } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "signup",
    });

    if (d2?.user) {
      toast.success("Signed up succesfully");
      console.log("Signed un successfully", d2);
      router.push("/");
      return;
    }
    if (e2) {
      toast.error("Failed to sign in / sign up");
      console.error("Failed to sign up", e2);
    }
  }

  return (
    <>
      <Head>
        <title>Rodoc - Health Overseer AI</title>
      </Head>
      <Toaster />
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="mx-auto max-w-md">
          <div className="border self-center rounded-lg my-8 p-4 m-4">
            <div className="text-center text-xl font-bold text-gray-800">
              Log In - Rodoc
            </div>

            <div className=" flex flex-col my-4">
              <label className="font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="border p-2 rounded-md mt-1"
                placeholder="john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-40 border text-sm font-medium px-4 py-2 mt-2 rounded-md bg-gray-50 hover:bg-gray-100"
                onClick={sendCode}
              >
                Send Code
              </button>
            </div>

            <div className=" flex flex-col my-4">
              <label className="font-medium text-gray-600">
                Verification Code
              </label>
              <input
                type="password"
                className="border p-2 rounded-md mt-1"
                placeholder="123456"
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />
              <button
                onClick={submitCode}
                className="w-40 border border-blue-600 text-sm font-medium px-4 py-2 mt-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Sign In
              </button>
            </div>

            <p className="text-gray-600 text-sm prose">
              {"By signing in, you agree to our "}
              <Link href="/terms">terms of use</Link>
              {" and "}
              <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
