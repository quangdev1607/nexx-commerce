"use client";

import { useCartStore } from "@/lib/zustand-store";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";

export const CartMessage = () => {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();

  return (
    <motion.div
      className="text-center"
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle>
        {checkoutProgress === "cart-page" ? "Your Cart Items" : null}
        {checkoutProgress === "customer-info" ? "Customer Info" : null}
        {checkoutProgress === "payment-page" ? "Confirm payment" : null}
        {checkoutProgress === "confirmation-page" ? "Order Confirmed" : null}
      </DrawerTitle>
      <DrawerDescription>
        {checkoutProgress === "cart-page" ? "  View and edit your bag." : null}
        {checkoutProgress === "customer-info" ? (
          <span
            onClick={() => setCheckoutProgress("cart-page")}
            className="flex cursor-pointer items-center justify-center gap-1 hover:text-primary"
          >
            <ArrowLeft size={14} /> Head back to cart
          </span>
        ) : null}
        {checkoutProgress === "payment-page" ? (
          <span
            onClick={() => setCheckoutProgress("customer-info")}
            className="flex cursor-pointer items-center justify-center gap-1 hover:text-primary"
          >
            <ArrowLeft size={14} /> Head back to customer info
          </span>
        ) : null}
        {checkoutProgress === "confirmation-page"
          ? "You will recieve an email with your receipt!"
          : null}
      </DrawerDescription>
    </motion.div>
  );
};
