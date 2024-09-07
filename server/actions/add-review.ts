"use server";

import { ReviewSchema } from "@/formSchema";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { db } from "../db";
import { reviews } from "../db/schema";

const actionClient = createSafeActionClient();

export const addReviewAction = actionClient
  .schema(ReviewSchema)
  .action(async ({ parsedInput: { comment, productID, rating } }) => {
    try {
      const session = await auth();
      if (!session) return { error: "You must login to add a review" };
      const existedReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id),
        ),
      });
      if (existedReview) {
        return { error: "You have already reviewed this product" };
      }

      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productID}`);
      return { success: newReview[0] };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
