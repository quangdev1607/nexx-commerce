"use client";

import { useCartStore } from "@/lib/zustand-store";
import { UserAddress } from "@/server/db/schema";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Session } from "next-auth";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { CartItems } from "./cart-items";
import { CartMessage } from "./cart-message";
import { PaymentConfirm } from "./cart-payment-confirm";
import { CartProgress } from "./cart-progress";
import { CustomerInfo } from "./customer-info";
import OrderConfirmed from "./order-confirm";

type CartDrawerProp = {
  session?: Session;
  userAddress?: UserAddress;
};

export const CartDrawer = ({ session, userAddress }: CartDrawerProp) => {
  const { cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } =
    useCartStore();

  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground dark:bg-primary"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "customer-info" && (
            <CustomerInfo
              userAddress={userAddress}
              userId={session?.user.id!}
            />
          )}
          {checkoutProgress === "payment-page" && (
            <PaymentConfirm
              userName={session?.user.name!}
              userAddress={userAddress!}
            />
          )}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
