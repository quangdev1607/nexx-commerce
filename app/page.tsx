import Algolia from "@/components/products/algolia";
import { Products } from "@/components/products/product";
import ProductTags from "@/components/products/product-tags";
import { db } from "@/server/db";

export const revalidate = 60 * 60;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  return (
    <main className="">
      <Algolia />
      <ProductTags />
      <Products variants={data} />
    </main>
  );
}
