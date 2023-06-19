import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
// import LoginModal from "./LoginModal";
// import { useLoginDialog } from "@/utils";

export default function Navbar() {
  // const { setLoginOpen } = useLoginDialog();
  const user = useUser();
  return (
    <nav className="shadow px-2 z-40">
      <div className="flex w-full max-w-4xl py-3 items-center justify-between mx-auto">
        <div className="text-2xl font-medium text-gray-800 flex items-center">
          <Link href="/" onClick={() => (window.location = "/")}>
            <Image
              src="/jobot_text_logo.png"
              height={32}
              width={117}
              className="object-contain"
              alt="logo"
              unoptimized
            />
          </Link>
        </div>
        <div>
          <Link href="/" className="text-gray-500 hover:text-blue-600 ml-4">
            Home
          </Link>
          <Link
            href="/build"
            className="text-gray-500 hover:text-blue-600 ml-4"
          >
            Build
          </Link>
          <Link
            href="https://github.com/jovianhq/jobot"
            className="text-gray-500 hover:text-blue-600 ml-4"
            target="_blank"
            rel="nonreferrer"
          >
            Doc
          </Link>
          {user ? (
            <Link
              href="/account"
              className="text-gray-500 hover:text-blue-600 ml-4"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-gray-500 hover:text-blue-600 ml-4"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
