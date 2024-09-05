"use server";

import { LoginSchema } from "@/formSchema";
import { signIn } from "@/server/auth";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { twoFactorTokens, users } from "../db/schema";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";

const actionClient = createSafeActionClient();

export const emailLogin = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
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

      if (existedUser.twoFactorEnabled && existedUser.email) {
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existedUser.email,
          );
          if (!twoFactorToken) {
            return { error: "Invalid token" };
          }
          if (twoFactorToken.token !== code) {
            return { error: "Invalid token" };
          }

          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "Token has expired" };
          }

          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existedUser.email);
          if (!token) {
            return { error: "Token not generated" };
          }

          await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
          return { twoFactor: "Two Factor Token sent! Check your email" };
        }
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
