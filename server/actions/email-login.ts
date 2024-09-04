"use server";

import { LoginSchema } from "@/formSchema";
import { signIn } from "@/server/auth";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { users } from "../db/schema";
import { sendVerificationEmail } from "./email";
import { generateEmailVerificationToken } from "./tokens";

const actionClient = createSafeActionClient();

export const emailLogin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existedUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existedUser?.email !== email) return { error: "Email not found" };

      if (!existedUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existedUser.email,
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token,
        );
        return { success: "Confirmation email sent" };
      }

      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });

      return { success: "User login successfully 🥳" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid email or password" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: "Something went wrong" };
        }
      }
      throw error;
    }
  });
