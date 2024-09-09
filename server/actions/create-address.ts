"use server";

import { AddressSchema } from "@/formSchema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { db } from "../db";
import { userAddress } from "../db/schema";

const actionClient = createSafeActionClient();

export const createUserAddress = actionClient
  .schema(AddressSchema)
  .action(
    async ({
      parsedInput: {
        address,
        province,
        district,
        phone,
        ward,
        userId,
        editMode,
      },
    }) => {
      try {
        if (editMode) {
          const editAddress = await db
            .update(userAddress)
            .set({
              district,
              address,
              phone,
              province,
              ward,
            })
            .where(eq(userAddress.userId, userId))
            .returning();

          return { success: "Updated address successfully" };
        }
        if (!editMode) {
          const newAddress = await db
            .insert(userAddress)
            .values({
              address,
              district,
              phone,
              province,
              userId,
              ward,
            })
            .returning();

          return { success: "Created user address" };
        }
      } catch (error) {
        return { error: "Failed to create user address" };
      }
    },
  );
