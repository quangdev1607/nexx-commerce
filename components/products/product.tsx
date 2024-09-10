"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";

import formatPrice from "@/lib/format-price";
import notFoundCar from "@/public/not-found-car.json";
import Lottie from "lottie-react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type ProductTypes = {
  variants: VariantsWithProduct[];
};

export function Products({ variants }: ProductTypes) {
  const params = useSearchParams();
  const paramTag = params.get("tag");

  const filtered = useMemo(() => {
    if (paramTag && variants) {
      const filterTags = variants.filter((variant) => {
        const filterVariants = variant.variantTags.some(
          (tag) => tag.tag === paramTag,
        );
        return filterVariants;
      });
      console.log(filterTags);
      return filterTags;
    }

    return variants;
  }, [paramTag]);

  if (filtered.length === 0)
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Products not found</h1>
        <Lottie className="h-80" animationData={notFoundCar} />
      </main>
    );

  return (
    <main className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((variant) => (
        <Link
          className="py-2"
          key={variant.id}
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
        >
          <Image
            className="rounded-md pb-2"
            src={variant.variantImages[0].url}
            width={720}
            height={480}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2>{variant.productType}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.product.title}
              </p>
            </div>
            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {formatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
