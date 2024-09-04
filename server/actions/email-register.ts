"use server";

import { RegisterSchema } from "@/formSchema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { users } from "../db/schema";
import { sendVerificationEmail } from "./email";
import { generateEmailVerificationToken } from "./tokens";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, username } }) => {
    const existedUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existedUser) {
      if (!existedUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token,
        );
        return { success: "Resent email confirmation" };
      }
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      name: username,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token,
    );

    return { success: "Confirmation email sent" };
  });
