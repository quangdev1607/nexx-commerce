"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export const StarsRating = ({
  rating,
  totalReviews,
  size = 14,
}: {
  rating: number;
  totalReviews?: number;
  size?: number;
}) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          size={size}
          key={star}
          className={cn(
            "bg-transparent text-primary transition-all duration-300 ease-in-out",
            rating >= star ? "fill-primary" : "fill-transparent",
          )}
        />
      ))}
      {totalReviews ? (
        <span className="ml-2 text-sm font-bold text-secondary-foreground">
          {totalReviews} reviews
        </span>
      ) : null}
    </div>
  );
};
