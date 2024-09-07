"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export const ProductPick = ({
  id,
  color,
  productType,
  title,
  price,
  productID,
  image,
}: {
  id: number;
  color: string;
  productType: string;
  title: string;
  price: number;
  image: string;
  productID: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type" || productType);

  return (
    <div
      style={{ background: color }}
      className={cn(
        "size-8 cursor-pointer rounded-full transition-all duration-300 ease-in-out hover:opacity-75",
        selectedColor === productType ? "opacity-100" : "opacity-50",
      )}
      onClick={() =>
        router.push(
          `/products/${id}?id=${id}&productID=${productID}&price=${price}&title=${title}&type=${productType}&image=${image}`,
          { scroll: false },
        )
      }
    ></div>
  );
};
