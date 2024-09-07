"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import { deleteReviewAction } from "@/server/actions/delete-review";
import { formatDistance, subDays } from "date-fns";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { StarsRating } from "./stars-rating";

export const ReviewsDisplay = ({
  reviews,
  userRole,
}: {
  reviews: ReviewsWithUser[];
  userRole?: string;
}) => {
  const { execute, status } = useAction(deleteReviewAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Review has been removed");
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },
  });
  return (
    <motion.div className="my-2 flex flex-col gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full"
                width={32}
                height={32}
                alt={review.user.name!}
                src={review.user.image!}
              />
              <div>
                <p className="text-sm font-bold">{review.user.name}</p>
                <div className="flex items-center gap-2">
                  <StarsRating rating={review.rating} />
                  <p className="text-bold text-xs text-muted-foreground">
                    {formatDistance(subDays(review.created!, 0), new Date())}
                  </p>
                </div>
              </div>
            </div>
            {userRole === "admin" && (
              <Button
                disabled={status === "executing"}
                onClick={() => execute({ reviewId: review.id })}
                className="!my-0 !p-1 leading-none"
                variant={"destructive"}
              >
                <XIcon width={24} height={24} />
              </Button>
            )}
          </div>
          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
};
