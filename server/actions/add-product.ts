"use server";
import { ProductSchema } from "@/formSchema";
import algoliasearch from "algoliasearch";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { products } from "../db/schema";

const actionClient = createSafeActionClient();

export const addProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { description, price, title, id } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: "Product not found" };
        const editedProduct = await db
          .update(products)
          .set({ description, price, title })
          .where(eq(products.id, id))
          .returning();

        revalidatePath("/dashboard/products");
        return {
          success: `Product ${editedProduct[0].title} has been updated`,
        };
      }

      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ description, price, title })
          .returning();

        revalidatePath("/dashboard/products");

        return { success: `Product ${newProduct[0].title} has been added` };
      }
    } catch (error) {
      return { error: "Failed to create product" };
    }
  });
