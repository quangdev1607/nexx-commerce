"use server";

import { DeleteVariantSchema } from "@/formSchema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { productVariants } from "../db/schema";

const actionClient = createSafeActionClient();



export const deleteVariant = actionClient
  .schema(DeleteVariantSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      return { success: `${deletedVariant[0].productType} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
