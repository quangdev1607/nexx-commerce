"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Socials() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Button
        variant={"outline"}
        className="flex w-full gap-4"
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <FcGoogle className="h-5 w-5" />
        <p>Sign in with Google</p>
      </Button>
      <Button
        className="flex w-full gap-4"
        variant={"outline"}
        onClick={() =>
          signIn("github", {
            redirect: false,
            callbackUrl: "/",
          })
        }
      >
        <FaGithub className="h-5 w-5" />
        Sign in with Github
      </Button>
    </div>
  );
}
