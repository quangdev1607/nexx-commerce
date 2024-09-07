import { ProductPick } from "@/components/products/product-pick";
import { ProductShowCase } from "@/components/products/product-showcase";
import { ProductType } from "@/components/products/product-type";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { db } from "@/server/db";
import { productVariants } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  if (data) {
    const slugID = data.map((variant) => ({ slug: variant.id.toString() }));
    return slugID;
  }
  return [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });
  if (!variant) throw new Error("Product not found");
  return (
    <main>
      <section className="flex flex-col gap-4 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <ProductShowCase variants={variant.product.productVariants} />
        </div>
        <div className="flex flex-1 flex-col">
          <h2 className="text-2xl font-bold">{variant.product.title}</h2>
          <div>
            <ProductType variants={variant.product.productVariants} />

            <span>Review stars here</span>
          </div>
          <Separator className="my-2" />
          <p className="py-2 text-2xl font-medium">
            {formatPrice(variant.product.price)}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: variant.product.description }}
          ></div>
          <p className="my-2 font-medium text-secondary-foreground">
            Available Colors
          </p>
          <div className="flex gap-4">
            {variant.product.productVariants.map((prodVariant) => (
              <ProductPick
                key={prodVariant.id}
                productID={variant.productID}
                id={prodVariant.id}
                color={prodVariant.color}
                price={variant.product.price}
                title={variant.product.title}
                image={prodVariant.variantImages[0].url}
                productType={prodVariant.productType}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
