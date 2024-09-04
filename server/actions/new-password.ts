"use server";

import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./tokens";

import { eq } from "drizzle-orm";

import { NewPasswordSchema } from "@/formSchema";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

import { db } from "../db";
import { passwordResetTokens, users } from "../db/schema";

const actionClient = createSafeActionClient();

export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    if (!token) {
      return { error: "Missing Token" };
    }
    //HERE we need to check if the token is valid
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token not found" };
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Token has expired" };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });
    return { success: "Password updated!" };
  });
