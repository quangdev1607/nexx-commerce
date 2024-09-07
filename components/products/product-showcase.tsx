"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

export const ProductShowCase = ({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || variants[0].productType;

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("slidesInView", (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);
  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (v) =>
            v.productType === selectedColor &&
            v.variantImages.map((img) => (
              <CarouselItem key={img.id} className="max-h-[600px]">
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.name}
                    width={1280}
                    height={720}
                    className="object-cover"
                  />
                ) : null}
              </CarouselItem>
            )),
        )}
      </CarouselContent>
      <div className="flex gap-4 overflow-clip py-2">
        {variants.map(
          (v) =>
            v.productType === selectedColor &&
            v.variantImages.map((img, idx) => (
              <div key={img.id} className="max-h-[90px]">
                {img.url ? (
                  <Image
                    onClick={() => updatePreview(idx)}
                    src={img.url}
                    alt={img.name}
                    width={72}
                    height={48}
                    priority
                    className={cn(
                      idx === activeThumbnail[0] ? "opacity-100" : "opacity-75",
                      "cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:opacity-75",
                    )}
                  />
                ) : null}
              </div>
            )),
        )}
      </div>
    </Carousel>
  );
};
