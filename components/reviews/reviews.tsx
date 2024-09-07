import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { reviews } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ReviewChart } from "./review-chart";
import { ReviewsDisplay } from "./reviews-display";
import { ReviewsForm } from "./reviews-form";

export const Reviews = async ({ productID }: { productID: number }) => {
  const data = await db.query.reviews.findMany({
    with: { user: true },
    where: eq(reviews.productID, productID),
    orderBy: (reviews, { desc }) => [desc(reviews.created)],
  });

  const session = await auth();

  return (
    <section className="py-4">
      <div className="flex flex-col justify-stretch gap-2 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">Product Reviews</h1>
          <ReviewsForm />
          <ReviewsDisplay userRole={session?.user.role} reviews={data} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
};
