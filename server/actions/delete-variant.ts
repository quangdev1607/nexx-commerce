"use server";

import { DeleteVariantSchema } from "@/formSchema";
import algoliasearch from "algoliasearch";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { productVariants } from "../db/schema";

const actionClient = createSafeActionClient();
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!,
);

const algoliaIndex = client.initIndex("products");

export const deleteVariant = actionClient
  .schema(DeleteVariantSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      algoliaIndex.deleteObject(deletedVariant[0].id.toString());
      revalidatePath("/dashboard/products");
      return { success: `${deletedVariant[0].productType} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
