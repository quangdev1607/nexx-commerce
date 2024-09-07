"use server";

import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { db } from "../db";
import { reviews } from "../db/schema";

const actionClient = createSafeActionClient();

export const deleteReviewAction = actionClient
  .schema(
    z.object({
      reviewId: z.number(),
    }),
  )
  .action(async ({ parsedInput: { reviewId } }) => {
    try {
      const review = await db.query.reviews.findFirst({
        where: eq(reviews.id, reviewId),
      });
      if (!review) return { error: "Review not found" };
      await db.delete(reviews).where(eq(reviews.id, reviewId)).returning();

      revalidatePath(`/product/${review.productID}`);
      return { success: "Delete review successfully" };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
