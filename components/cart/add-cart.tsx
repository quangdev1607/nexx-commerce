"use client";

import { useCartStore } from "@/lib/zustand-store";
import { Minus, Plus } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export const AddToCart = () => {
  const { addToCart } = useCartStore();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const productID = Number(searchParams.get("productID"));
  const price = Number(searchParams.get("price"));
  const title = searchParams.get("title");
  const type = searchParams.get("type");
  const image = searchParams.get("image");

  if (!id || !productID || !title || !type || !price || !image) {
    throw new Error("Product not found");
  }

  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="my-4 flex items-center justify-stretch gap-4">
        <Button
          className="text-primary"
          variant={"secondary"}
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button variant={"secondary"} className="flex-1">
          Quantity: {quantity}
        </Button>
        <Button
          className="text-primary"
          variant={"secondary"}
          onClick={() => {
            setQuantity(quantity + 1);
          }}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added ${title + " " + type} to your cart!`);
          addToCart({
            id: productID,
            variant: { variantID: id, quantity },
            itemName: title + " " + type,
            price,
            image,
          });
        }}
      >
        Add to cart
      </Button>
    </>
  );
};
