"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import { getReviewAverage } from "@/lib/review-average";
import { useMemo } from "react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

export const ReviewChart = ({ reviews }: { reviews: ReviewsWithUser[] }) => {
  const getRatingByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;
    reviews.forEach((review) => {
      const starIndex = review.rating - 1;
      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    });
    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);
  const totalRating = getReviewAverage(reviews.map((review) => review.rating));

  return (
    <Card className="flex flex-col gap-4 rounded-md p-8">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription>{totalRating.toFixed(1)} stars</CardDescription>
      </div>
      {getRatingByStars.map((rating, index) => (
        <div key={index} className="flex items-center justify-between gap-2">
          <p className="flex gap-1 text-xs font-medium">
            {index + 1} <span>stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
};
