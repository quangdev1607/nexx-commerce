"use server";

import { ResetSchema } from "@/formSchema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { users } from "../db/schema";
import { sendPasswordResetEmail } from "./email";
import { generatePasswordResetToken } from "./tokens";

const actionClient = createSafeActionClient();

export const reset = actionClient
  .schema(ResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existedUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existedUser) {
      return { error: "User not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) {
      return { error: "Token not generated" };
    }

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token,
    );

    return { success: "Email sent!" };
  });
