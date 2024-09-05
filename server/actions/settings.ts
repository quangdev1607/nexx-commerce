"use server";

import { SettingsSchema } from "@/formSchema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { db } from "../db";
import { users } from "../db/schema";

const actionClient = createSafeActionClient();

export const settingsAction = actionClient
  .schema(SettingsSchema)
  .action(
    async ({
      parsedInput: {
        email,
        image,
        password,
        newPassword,
        name,
        isTwoFactorEnabled,
      },
    }) => {
      const user = await auth();
      if (!user) {
        return { error: "User not found" };
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
      });

      if (!dbUser) {
        return { error: "User not found" };
      }

      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        isTwoFactorEnabled = undefined;
      }

      if (password && newPassword && dbUser.password) {
        console.log({ password, newPassword }, dbUser.password);
        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
          return { error: "Password does not match" };
        }

        const samePassword = await bcrypt.compare(newPassword, dbUser.password);

        if (samePassword) {
          return {
            error:
              "Your new password must be different from your previous password.",
          };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }
      await db
        .update(users)
        .set({
          twoFactorEnabled: isTwoFactorEnabled,
          name,
          email,
          password,
          image,
        })
        .where(eq(users.id, dbUser.id));

      revalidatePath("/dashboard/settings");
      return { success: "Settings updated successfully!" };
    },
  );
