"use client";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export const ProductType = ({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) => {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get("type") || variants[0].productType;

  return variants.map((v) => {
    if (v.productType === selectedType) {
      return (
        <motion.div
          key={v.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-medium text-secondary-foreground"
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        >
          {selectedType}
        </motion.div>
      );
    }
  });
};
