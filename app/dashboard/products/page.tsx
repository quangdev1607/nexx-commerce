import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { redirect } from "next/navigation";
import { DataTable } from "./data-table";

import placeholder from "@/public/placeholder_small.jpg";
import { columns } from "./columns";

export default async function ProductPage() {
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  const allProducts = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (allProducts, { desc }) => [desc(allProducts.id)],
  });

  if (!allProducts) throw new Error("No products found");

  const dataTable = allProducts.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }
    const image = product.productVariants[0].variantImages[0]?.url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });

  if (!dataTable) throw new Error("No data found");
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
