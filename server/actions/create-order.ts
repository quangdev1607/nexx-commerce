"use server";

import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";

import { CreateOrderSchema } from "@/formSchema";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { orderProduct, orders } from "../db/schema";

const actionClient = createSafeActionClient();

export const creatOrderAction = actionClient
  .schema(CreateOrderSchema)
  .action(async ({ parsedInput: { products, status, total } }) => {
    const user = await auth();
    if (!user) return { error: "user not found" };

    const order = await db
      .insert(orders)
      .values({
        status,
        total,
        userID: user.user.id,
      })
      .returning();
    const orderProducts = products.map(
      async ({ productID, quantity, variantID }) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantID: variantID,
        });
      },
    );
    revalidatePath("/dashboard/orders");
    return { success: "Order has been added" };
  });
