"use server";

import { DeleteProductSchema } from "@/formSchema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { products } from "../db/schema";

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
  .schema(DeleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const productData = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      return { success: `Product ${productData[0].title} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete product" };
    }
  });
